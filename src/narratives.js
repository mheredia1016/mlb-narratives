import { getSchedule, getTeamRoster, getPeople, getPlayerStats } from './mlb.js';
import { getManualNarratives } from './manual.js';
import { getPromoNarratives } from './promotions.js';
import { getNewsNarratives } from './newsSearch.js';
import { todayLocalISO, mmdd } from './date.js';

function gameLabel(game) {
  const away = game.teams.away.team.abbreviation || game.teams.away.team.name;
  const home = game.teams.home.team.abbreviation || game.teams.home.team.name;
  return `${away} @ ${home}`;
}

function push(alerts, alert) {
  if (!alert.playerName && !alert.title) return;
  alerts.push(alert);
}

function getCareerStat(stats, key) {
  const splits = stats?.stats?.find(s => s.type?.displayName === 'career')?.splits || [];
  for (const s of splits) {
    const stat = s.stat || {};
    if (stat[key] !== undefined) return Number(stat[key]);
  }
  return null;
}

function milestoneChecks(player, stats, game) {
  const out = [];
  const hitting = {
    homeRuns: [99, 149, 199, 249, 299, 349, 399, 449, 499],
    hits: [999, 1499, 1999, 2499, 2999],
    rbi: [499, 749, 999, 1199, 1499],
    stolenBases: [49, 99, 149, 199, 299, 399]
  };

  for (const [key, targets] of Object.entries(hitting)) {
    const val = getCareerStat(stats, key);
    if (val === null) continue;

    for (const target of targets) {
      if (val === target) {
        out.push({
          type: 'milestone',
          score: 22,
          playerName: player.fullName,
          teamName: player.currentTeam?.name,
          game: gameLabel(game),
          title: `${player.fullName} needs 1 ${key} for ${target + 1}`,
          details: `Career ${key}: ${val}.`
        });
      }
    }
  }

  return out;
}

function dedupeAlerts(alerts) {
  const seen = new Set();
  return alerts.filter(a => {
    const key = `${a.type}|${a.playerName || ''}|${a.teamName || ''}|${a.title || ''}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function buildNarratives(config) {
  const date = todayLocalISO(config.timezone);
  const schedule = await getSchedule(date);
  const games = schedule.dates?.[0]?.games || [];

  const teamIds = new Set();
  const gameTeams = [];
  const gamesByTeamId = new Map();

  for (const game of games) {
    const label = gameLabel(game);
    for (const side of ['away', 'home']) {
      const team = game.teams[side].team;
      teamIds.add(team.id);
      const abbrev = team.abbreviation || team.name;
      gameTeams.push({ id: team.id, abbrev, name: team.name, gameLabel: label });
      gamesByTeamId.set(team.id, { label, game });
    }
  }

  const rosterRows = [];
  for (const teamId of teamIds) {
    const roster = await getTeamRoster(teamId);
    for (const r of roster.roster || []) {
      rosterRows.push({ teamId, personId: r.person.id, playerName: r.person.fullName });
    }
  }

  const people = await getPeople([...new Set(rosterRows.map(r => r.personId))]);
  const peopleList = people.people || [];
  const peopleById = new Map(peopleList.map(p => [p.id, p]));

  const alerts = [];

  for (const game of games) {
    const gameTeamIds = [game.teams.away.team.id, game.teams.home.team.id];
    const gamePlayers = rosterRows.filter(r => gameTeamIds.includes(r.teamId));

    for (const row of gamePlayers) {
      const p = peopleById.get(row.personId);
      if (!p) continue;

      if (mmdd(p.birthDate) === mmdd(date)) {
        push(alerts, {
          type: 'birthday',
          score: 30,
          playerName: p.fullName,
          teamName: p.currentTeam?.name,
          game: gameLabel(game),
          title: `Birthday game: ${p.fullName}`,
          details: `${p.fullName} was born on ${p.birthDate}.`
        });
      }

      const stats = await getPlayerStats(p.id, config.season).catch(() => null);
      for (const a of milestoneChecks(p, stats, game)) push(alerts, a);

      if (p.mlbDebutDate && p.mlbDebutDate === date) {
        push(alerts, {
          type: 'debut',
          score: 35,
          playerName: p.fullName,
          teamName: p.currentTeam?.name,
          game: gameLabel(game),
          title: `MLB debut: ${p.fullName}`,
          details: `${p.fullName} is listed with MLB debut date ${p.mlbDebutDate}.`
        });
      }
    }
  }

  for (const a of await getPromoNarratives({ date, gameTeams, config })) push(alerts, a);
  for (const a of await getNewsNarratives({ players: peopleList, gamesByTeamId, config })) push(alerts, a);

  const manual = await getManualNarratives(date);
  for (const m of manual) {
    push(alerts, {
      type: m.type || 'manual',
      score: Number(m.score || 25),
      playerName: m.playerName,
      teamName: m.teamAbbrev,
      game: m.game || '',
      title: m.title,
      details: m.details || ''
    });
  }

  return dedupeAlerts(alerts)
    .filter(a => a.score >= config.minScore)
    .sort((a, b) => b.score - a.score);
}
