export async function postDiscord(webhookUrl, content) {
  if (!webhookUrl) throw new Error('Missing DISCORD_WEBHOOK_URL');

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content })
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Discord ${res.status}: ${text.slice(0, 500)}`);
  return true;
}
