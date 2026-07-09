import { searchSerpApiNews } from './newsSearch.js';
import { scoreText } from './scoring.js';
import { todayParts } from './newsDate.js';

function uniqueBy(items, keyFn) {
  const seen = new Set();

  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function leagueQueries(config) {
  const today = todayParts(config.timezone || 'America/Chicago');

  const queries = [
    `site:mlb.com/news MLB today reinstated from injured list activated from IL "${today.shortDate}"`,
    `site:mlb.com/news MLB today called up promoted recalled from Triple-A "${today.shortDate}"`,
    `site:mlb.com/news MLB debut today major league debut "${today.shortDate}"`,
    `site:mlb.com/news MLB starting lineup today first game back "${today.shortDate}"`,
    `site:mlb.com/news MLB transactions today injured list "${today.shortDate}"`,
    `MLB today reinstated from injured list activated from IL`,
    `MLB today called up promoted recalled from Triple-A`,
    `MLB prospect called up today starting lineup`,
    `MLB player first game back today`,
    `MLB roster moves today starting lineup`
  ];

  if (!config.enableMlbComSearch) {
    return queries.filter((q) => !q.includes('site:mlb.com'));
  }

  return queries.slice(0, config.maxLeagueNewsQueries || 10);
}

function findMentionedPlayers(text, players) {
  const lower = String(text || '').toLowerCase();
  return players.filter((p) => lower.includes(p.fullName.toLowerCase()));
}

function gameForPlayer(player, gamesByTeamId) {
  return gamesByTeamId.get(player.currentTeam?.id);
}

export async function getLeagueNewsIntel({ allPlayers, gamesByTeamId, config }) {
  const counters = {
    queries: 0,
    results: 0,
    scoredResults: 0,
    matchedPlayers: 0
  };

  const alerts = [];

  if (!config.enableLeagueNewsScan || !config.serpApiKey) {
    return { alerts, counters };
  }

  for (const query of leagueQueries(config)) {
    counters.queries += 1;

    let results = [];

    try {
      results = await searchSerpApiNews(query, config);
    } catch (err) {
      console.error('League news search failed:', err.message);
      continue;
    }

    counters.results += results.length;

    for (const r of results) {
      const text = `${r.title} ${r.snippet}`;
      const scored = await scoreText(text);

      if (scored.score <= 0) continue;

      counters.scoredResults += 1;

      const mentioned = findMentionedPlayers(text, allPlayers);
      counters.matchedPlayers += mentioned.length;

      if (mentioned.length) {
        for (const p of mentioned.slice(0, 3)) {
          const game = gameForPlayer(p, gamesByTeamId);

          alerts.push({
            type:
              scored.hits.some(
                (h) =>
                  h.includes('injured list') ||
                  h.includes('IL') ||
                  h.includes('first game back')
              )
                ? 'return'
                : 'news',
            score: Math.min(80, scored.score + 15),
            playerName: p.fullName,
            teamName: p.currentTeam?.name || '',
            game: game?.label || '',
            title: `${p.fullName}: ${r.title}`,
            details: [
              `League news hit: ${scored.hits.join(', ')}`,
              r.date ? `Age: ${r.date}` : '',
              r.source ? `Source: ${r.source}` : '',
              r.link || ''
            ]
              .filter(Boolean)
              .join(' | '),
            sourceUrl: r.link || ''
          });
        }
      } else {
        alerts.push({
          type: 'news',
          score: Math.min(65, scored.score),
          playerName: '',
          teamName: '',
          game: '',
          title: r.title,
          details: [
            `League news hit: ${scored.hits.join(', ')}`,
            r.date ? `Age: ${r.date}` : '',
            r.source ? `Source: ${r.source}` : '',
            r.link || ''
          ]
            .filter(Boolean)
            .join(' | '),
          sourceUrl: r.link || ''
        });
      }
    }
  }

  return {
    alerts: uniqueBy(
      alerts,
      (a) => `${a.playerName}|${a.title}|${a.sourceUrl}`.toLowerCase()
    )
      .sort((a, b) => b.score - a.score)
      .slice(0, config.maxLeagueNewsAlerts || 15),
    counters
  };
}
