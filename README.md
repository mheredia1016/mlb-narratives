# MLB Pregame Intel — Free v7

No SerpAPI, NewsAPI, or paid key. Uses MLB Stats API, MLB league/team RSS feeds, MLB team news pages as fallback, official transactions, and promotion pages.

## GitHub
1. Create a new repository.
2. Upload every file/folder from this ZIP.
3. Commit. Do not upload a real `.env`.

## Railway variables
```env
DISCORD_WEBHOOK_URL=YOUR_WEBHOOK
TIMEZONE=America/Chicago
POST_CRON=0 10 * * *
RUN_ON_START=true
MLB_SEASON=2026
NEWS_LOOKBACK_HOURS=36
MIN_INTEL_SCORE=25
MAX_ARTICLES_PER_FEED=20
MAX_DISCORD_MESSAGES=8
ENABLE_MLB_NEWS=true
ENABLE_TEAM_NEWS=true
ENABLE_TRANSACTIONS=true
ENABLE_PROMOTIONS=true
ENABLE_BIRTHDAYS=true
ENABLE_MILESTONES=true
ALWAYS_POST_REPORT=true
```

Railway runs `npm start`. For one immediate run, use `npm run run`.

## Add phrases
Edit `data/keywords.json`. The score must meet `MIN_INTEL_SCORE`.

## Logs
Shows games, players, birthdays, milestones, transactions, promotions, feeds, articles, fresh articles, and scored articles.

## Limitation
Family-attendance items only appear when MLB or a team publishes them in its feed/news page.
