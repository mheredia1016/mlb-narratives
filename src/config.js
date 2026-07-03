import 'dotenv/config';
export const config = {
  webhookUrl: process.env.DISCORD_WEBHOOK_URL,
  timezone: process.env.TIMEZONE || 'America/Chicago',
  postCron: process.env.POST_CRON || '0 10 * * *',
  runOnStart: String(process.env.RUN_ON_START || 'false').toLowerCase() === 'true',
  season: process.env.MLB_SEASON || String(new Date().getFullYear()),
  minScore: Number(process.env.MIN_NARRATIVE_SCORE || 20),
  maxDiscordChars: Number(process.env.MAX_DISCORD_CHARS || 1900),
  enablePromoScraper: String(process.env.ENABLE_PROMO_SCRAPER || 'true').toLowerCase() === 'true',
  enableNewsNarratives: String(process.env.ENABLE_NEWS_NARRATIVES || 'true').toLowerCase() === 'true',
  enableLeagueNewsScan: String(process.env.ENABLE_LEAGUE_NEWS_SCAN || 'true').toLowerCase() === 'true',
  enableMlbComSearch: String(process.env.ENABLE_MLB_COM_SEARCH || 'true').toLowerCase() === 'true',
  newsProvider: process.env.NEWS_PROVIDER || 'serpapi',
  serpApiKey: process.env.SERPAPI_KEY || '',
  newsLookbackHours: Number(process.env.NEWS_LOOKBACK_HOURS || 24),
  newsMaxResultsPerQuery: Number(process.env.NEWS_MAX_RESULTS_PER_QUERY || 5),
  maxPlayersToNewsScan: Number(process.env.MAX_PLAYERS_TO_NEWS_SCAN || 6),
  newsSearchesPerPlayer: Number(process.env.NEWS_SEARCHES_PER_PLAYER || 3),
  maxLeagueNewsQueries: Number(process.env.MAX_LEAGUE_NEWS_QUERIES || 10),
  maxLeagueNewsAlerts: Number(process.env.MAX_LEAGUE_NEWS_ALERTS || 15),
  alwaysPostReport: String(process.env.ALWAYS_POST_REPORT || 'true').toLowerCase() === 'true',
  includeEmptyGames: String(process.env.INCLUDE_EMPTY_GAMES || 'true').toLowerCase() === 'true'
};
