function emoji(type) {
  return {
    birthday: '🎂',
    milestone: '📈',
    debut: '🧢',
    promotion: '🎁',
    family: '👨‍👩‍👧',
    revenge: '🏠',
    news: '📰',
    manual: '📝'
  }[type] || '⚾';
}

export function buildReport(alerts, maxChars) {
  if (!alerts.length) return '⚾ **MLB Narrative Report**\n\nNo qualified narrative alerts today.';

  const lines = ['⚾ **MLB Narrative Report**', ''];

  for (const a of alerts) {
    lines.push(`${emoji(a.type)} **${a.title}**`);
    if (a.game) lines.push(`Game: ${a.game}`);
    lines.push(`Score: ${a.score}`);
    if (a.details) lines.push(a.details);
    lines.push('');
  }

  let text = lines.join('\n').trim();
  if (text.length > maxChars) text = text.slice(0, maxChars - 40).trim() + '\n\n…truncated';
  return text;
}
