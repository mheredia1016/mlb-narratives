import cron from 'node-cron';
import { config } from './config.js';
import { buildNarratives } from './narratives.js';
import { buildReport } from './report.js';
import { postDiscord } from './discord.js';

async function run() {
  console.log(`[${new Date().toISOString()}] Building MLB narrative report...`);

  const alerts = await buildNarratives(config);
  console.log(`Qualified alerts: ${alerts.length}`);

  const report = buildReport(alerts, config.maxDiscordChars);
  console.log(report);

  await postDiscord(config.webhookUrl, report);
  console.log('Posted to Discord.');
}

const once = process.argv.includes('--once');

if (once || config.runOnStart) {
  run().catch(err => {
    console.error(err);
    process.exitCode = 1;
  });
}

if (!once) {
  console.log(`MLB Narrative Alert Bot scheduled: ${config.postCron} ${config.timezone}`);
  cron.schedule(config.postCron, () => {
    run().catch(err => console.error('Run failed:', err));
  }, { timezone: config.timezone });
}
