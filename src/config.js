import 'dotenv/config';
const b=(n,d=true)=>String(process.env[n]??d).toLowerCase()==='true';
export const config={
 webhookUrl:process.env.DISCORD_WEBHOOK_URL||'', timezone:process.env.TIMEZONE||'America/Chicago', postCron:process.env.POST_CRON||'0 10 * * *', runOnStart:b('RUN_ON_START',true),
 season:process.env.MLB_SEASON||String(new Date().getFullYear()), newsLookbackHours:Number(process.env.NEWS_LOOKBACK_HOURS||36), minScore:Number(process.env.MIN_INTEL_SCORE||25), maxArticlesPerFeed:Number(process.env.MAX_ARTICLES_PER_FEED||20), maxDiscordMessages:Number(process.env.MAX_DISCORD_MESSAGES||8),
 enableMlbNews:b('ENABLE_MLB_NEWS'), enableTeamNews:b('ENABLE_TEAM_NEWS'), enableTransactions:b('ENABLE_TRANSACTIONS'), enablePromotions:b('ENABLE_PROMOTIONS'), enableBirthdays:b('ENABLE_BIRTHDAYS'), enableMilestones:b('ENABLE_MILESTONES'), alwaysPostReport:b('ALWAYS_POST_REPORT')
};
