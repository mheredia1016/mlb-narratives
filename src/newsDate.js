export function todayParts(timezone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).formatToParts(new Date());

  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;

  return {
    year,
    month,
    day,
    shortDate: `${month} ${Number(day)}`,
    longDate: `${month} ${Number(day)}, ${year}`
  };
}

export function parseNewsAgeToHours(dateText) {
  const s = String(dateText || '').trim().toLowerCase();
  if (!s) return null;

  if (s.includes('minute')) return Number((s.match(/(\d+)/) || [])[1] || 1) / 60;
  if (s.includes('hour')) return Number((s.match(/(\d+)/) || [])[1] || 1);
  if (s === 'today') return 12;
  if (s === 'yesterday') return 36;
  if (s.includes('day')) return Number((s.match(/(\d+)/) || [])[1] || 1) * 24;
  if (s.includes('week')) return Number((s.match(/(\d+)/) || [])[1] || 1) * 24 * 7;
  if (s.includes('month')) return 9999;
  return null;
}

export function isFreshNewsItem(item, maxHours) {
  const age = parseNewsAgeToHours(item.date);
  if (age === null) {
    const text = `${item.title || ''} ${item.snippet || ''}`.toLowerCase();
    return text.includes('today') || text.includes('tonight');
  }
  return age <= maxHours;
}
