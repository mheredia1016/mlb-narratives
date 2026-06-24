import { scoreText } from './scoring.js';

function hoursToSerpApiWhen(hours) {
  if (hours <= 24) return 'd';
  if (hours <= 168) return 'w';
  return 'm';
}

export async function searchSerpApiNews(query, config) {
  if (!config.serpApiKey) return [];

  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_news');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', config.serpApiKey);
  url.searchParams.set('num', String(config.newsMaxResultsPerQuery || 5));
  url.searchParams.set('when', hoursToSerpApiWhen(config.newsLookbackHours || 48));

  const res = await fetch(url);
  const text = await res.text();

  let json;
  try { json = text ? JSON.parse(text) : {}; }
  catch { throw new Error(`SerpAPI non-JSON response: ${text.slice(0, 300)}`); }

  if (!res.ok) {
    throw new Error(`SerpAPI ${res.status}: ${JSON.stringify(json).slice(0, 500)}`);
  }

  return (json.news_results || []).map(r => ({
    title: r.title || '',
    source: r.source?.name || r.source || '',
    link: r.link || '',
    snippet: r.snippet || '',
    date: r.date || ''
  }));
}

export async function getNewsNarratives({ players, gamesByTeamId, config }) {
  if (!config.enableNewsNarratives) return [];
  if (config.newsProvider !== 'serpapi') return [];
  if (!config.serpApiKey) return [];

  const alerts = [];
  const scanPlayers = players.slice(0, config.maxPlayersToNewsScan || 80);

  for (const p of scanPlayers) {
    const teamName = p.currentTeam?.name || '';
    const query = `"${p.fullName}" ${teamName} (family OR parents OR wife OR son OR daughter OR newborn OR hometown OR "former team" OR bobblehead OR giveaway OR tribute OR debut OR "first game back")`;

    let results = [];
    try {
      results = await searchSerpApiNews(query, config);
    } catch (err) {
      console.error(`News search failed for ${p.fullName}:`, err.message);
      continue;
    }

    for (const r of results) {
      const text = `${r.title} ${r.snippet}`;
      const scored = await scoreText(text);
      if (scored.score <= 0) continue;

      const game = gamesByTeamId.get(p.currentTeam?.id);

      alerts.push({
        type: scored.hits.includes('bobblehead') || scored.hits.includes('giveaway') ? 'promotion' : 'news',
        score: Math.min(60, scored.score),
        playerName: p.fullName,
        teamName,
        game: game?.label || '',
        title: `${p.fullName}: ${r.title}`,
        details: `Keyword hits: ${scored.hits.join(', ')}${r.source ? ` | Source: ${r.source}` : ''}${r.link ? ` | ${r.link}` : ''}`
      });
    }
  }

  return alerts;
}
