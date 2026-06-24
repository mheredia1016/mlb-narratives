import 'dotenv/config';

export const config = {
  webhookUrl: process.env.DISCORD_WEBHOOK_URL,
  timezone: process.env.TIMEZONE || 'America/Chicago',
  postCron: process.env.POST_CRON || '0 10 * * *',
  runOnStart: String(process.env.RUN_ON_START || 'false').toLowerCase() === 'true',

  season: process.env.MLB_SEASON || String(new Date().getFullYear()),
  minScore: Number(process.env.MIN_NARRATIVE_SCORE || 25),
  maxDiscordChars: Number(process.env.MAX_DISCORD_CHARS || 1850),

  enablePromoScraper: String(process.env.ENABLE_PROMO_SCRAPER || 'true').toLowerCase() === 'true',
  enableNewsNarratives: String(process.env.ENABLE_NEWS_NARRATIVES || 'true').toLowerCase() === 'true',

  newsProvider: process.env.NEWS_PROVIDER || 'serpapi',
  serpApiKey: process.env.SERPAPI_KEY || '',
  newsLookbackHours: Number(process.env.NEWS_LOOKBACK_HOURS || 48),
  newsMaxResultsPerQuery: Number(process.env.NEWS_MAX_RESULTS_PER_QUERY || 5),
  maxPlayersToNewsScan: Number(process.env.MAX_PLAYERS_TO_NEWS_SCAN || 80)
};
