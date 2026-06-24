import { readJson } from './files.js';
import { scoreText } from './scoring.js';

function compactHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dateTokens(date) {
  const [y, m, d] = date.split('-');
  const dt = new Date(`${date}T12:00:00Z`);
  const monthLong = dt.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const monthShort = dt.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  return [
    `${monthLong} ${Number(d)}`,
    `${monthShort} ${Number(d)}`,
    `${Number(m)}/${Number(d)}`,
    `${m}/${d}`,
    date
  ];
}

export async function getPromoNarratives({ date, gameTeams, config }) {
  if (!config.enablePromoScraper) return [];

  const teams = await readJson('../data/teams.json', []);
  const byAbbrev = new Map(teams.map(t => [t.abbrev, t]));
  const tokens = dateTokens(date);
  const alerts = [];

  for (const gameTeam of gameTeams) {
    const team = byAbbrev.get(gameTeam.abbrev);
    if (!team?.promoUrl) continue;

    let html = '';
    try {
      const res = await fetch(team.promoUrl, { headers: { 'user-agent': 'Mozilla/5.0 narrative-bot' } });
      html = await res.text();
      if (!res.ok) continue;
    } catch {
      continue;
    }

    const text = compactHtml(html);
    const lower = text.toLowerCase();

    const hasDate = tokens.some(t => lower.includes(t.toLowerCase()));
    if (!hasDate) continue;

    const scored = await scoreText(text);
    const promoWords = ['bobblehead', 'giveaway', 'jersey', 'theme night', 'replica', 'hat', 'shirt'];
    const promoHit = promoWords.find(w => lower.includes(w));

    if (!promoHit && scored.score < 18) continue;

    alerts.push({
      type: 'promotion',
      score: Math.max(25, Math.min(55, scored.score || 25)),
      teamName: team.name,
      game: gameTeam.gameLabel,
      title: `${team.abbrev} promotion/theme night detected`,
      details: `Date matched ${date}. Promo page contains: ${promoHit || scored.hits?.join(', ') || 'promotion keyword'}. ${team.promoUrl}`
    });
  }

  return alerts;
}
