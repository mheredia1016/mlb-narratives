const BASE='https://statsapi.mlb.com/api/v1';
async function getJson(url,label){const r=await fetch(url,{headers:{'user-agent':'mlb-pregame-intel-free/7.0'}});const t=await r.text();let d;try{d=t?JSON.parse(t):{};}catch{throw new Error(`${label}: invalid JSON`);}if(!r.ok)throw new Error(`${label}: HTTP ${r.status}: ${t.slice(0,300)}`);return d;}
export async function getSchedule(date){const u=new URL(`${BASE}/schedule`);u.searchParams.set('sportId','1');u.searchParams.set('date',date);u.searchParams.set('hydrate','team,probablePitcher,venue');return getJson(u,'schedule');}
export const getRoster=id=>getJson(`${BASE}/teams/${id}/roster?rosterType=active`,`roster ${id}`);
export async function getPeople(ids){if(!ids.length)return {people:[]};const u=new URL(`${BASE}/people`);u.searchParams.set('personIds',ids.join(','));u.searchParams.set('hydrate','currentTeam');return getJson(u,'people');}
export const getBoxscore=pk=>getJson(`${BASE}/game/${pk}/boxscore`,`boxscore ${pk}`);
export async function getPlayerStats(id,season){const u=new URL(`${BASE}/people/${id}/stats`);u.searchParams.set('stats','career');u.searchParams.set('group','hitting');u.searchParams.set('season',season);return getJson(u,`stats ${id}`);}
export async function getTransactions(startDate,endDate){const u=new URL(`${BASE}/transactions`);u.searchParams.set('sportId','1');u.searchParams.set('startDate',startDate);u.searchParams.set('endDate',endDate);return getJson(u,'transactions');}
