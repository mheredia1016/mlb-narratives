import fs from 'fs/promises';

export async function readJson(relativePath, fallback) {
  try {
    const raw = await fs.readFile(new URL(relativePath, import.meta.url), 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
