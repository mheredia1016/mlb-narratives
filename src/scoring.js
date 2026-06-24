import { readJson } from './files.js';

export async function scoreText(text) {
  const keywords = await readJson('../data/narrativeKeywords.json', {});
  const lower = String(text || '').toLowerCase();

  let score = 0;
  const hits = [];

  for (const [keyword, points] of Object.entries(keywords)) {
    if (lower.includes(keyword.toLowerCase())) {
      score += Number(points || 0);
      hits.push(keyword);
    }
  }

  return { score, hits };
}
