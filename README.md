# MLB Pregame Intel Bot v6

v6 fixes stale SerpAPI/Google News results.

## Changes
- Rejects news older than `NEWS_LOOKBACK_HOURS`.
- Adds `today` and today's date to searches.
- Adds `Age: 4 hours ago` etc. in Discord details.

## Recommended Railway vars

```env
NEWS_LOOKBACK_HOURS=24
ENABLE_LEAGUE_NEWS_SCAN=true
ENABLE_MLB_COM_SEARCH=true
NEWS_MAX_RESULTS_PER_QUERY=5
MAX_PLAYERS_TO_NEWS_SCAN=6
NEWS_SEARCHES_PER_PLAYER=3
MAX_LEAGUE_NEWS_QUERIES=10
```

For stricter same-day only:

```env
NEWS_LOOKBACK_HOURS=12
```
