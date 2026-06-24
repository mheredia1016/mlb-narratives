import { readJson } from './files.js';

export async function getManualNarratives(date) {
  const rows = await readJson('../data/manualNarratives.json', []);
  return rows.filter(r => r.date === date);
}
