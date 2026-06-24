# MLB Narrative Alert Bot v2

Automated MLB narrative alerts for Discord.

## Covers

- birthdays
- milestone watch
- MLB debuts
- bobbleheads / giveaways / theme nights from MLB promo pages
- automated player/team news narratives through SerpAPI
- manual fallback notes

## Railway

1. Push repo to GitHub.
2. Connect GitHub repo to Railway.
3. Add variables from `.env.example`.
4. Start command:

```bash
npm start
```

## Run once

```bash
npm install
cp .env.example .env
npm run run
```

## SerpAPI

Add:

```env
NEWS_PROVIDER=serpapi
SERPAPI_KEY=your_key_here
ENABLE_NEWS_NARRATIVES=true
```

Without SerpAPI, the bot still runs birthdays, milestones, debuts, promo scraping, and manual fallback.

## Promo scraping

Promo URLs are stored in:

```txt
data/teams.json
```

You can add or replace promo page URLs anytime.
