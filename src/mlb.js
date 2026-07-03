const MLB_BASE = 'https://statsapi.mlb.com/api/v1';

async function getJson(url, label) {
  const res = await fetch(url);
  const text = await res.text();

  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`${label}: non-JSON response: ${text.slice(0, 300)}`);
  }

  if (!res.ok) {
    throw new Error(`${label}: MLB ${res.status}: ${JSON.stringify(json).slice(0, 500)}`);
  }

  return json;
}

export async function getSchedule(date) {
  const url = new URL(`${MLB_BASE}/schedule`);
  url.searchParams.set('sportId', '1');
  url.searchParams.set('date', date);
  url.searchParams.set('hydrate', 'team,venue,probablePitcher');
  return getJson(url, 'schedule');
}

export async function getTeamRoster(teamId) {
  const url = new URL(`${MLB_BASE}/teams/${teamId}/roster`);
  url.searchParams.set('rosterType', 'active');
  return getJson(url, `roster ${teamId}`);
}

export async function getPeople(ids) {
  if (!ids.length) return { people: [] };

  const url = new URL(`${MLB_BASE}/people`);
  url.searchParams.set('personIds', ids.join(','));
  url.searchParams.set('hydrate', 'currentTeam');
  return getJson(url, 'people');
}

export async function getPlayerStats(playerId, season) {
  const url = new URL(`${MLB_BASE}/people/${playerId}/stats`);
  url.searchParams.set('stats', 'season,career');
  url.searchParams.set('group', 'hitting,pitching');
  url.searchParams.set('season', season);
  return getJson(url, `stats ${playerId}`);
}

export async function getBoxscore(gamePk) {
  return getJson(`${MLB_BASE}/game/${gamePk}/boxscore`, `boxscore ${gamePk}`);
}
