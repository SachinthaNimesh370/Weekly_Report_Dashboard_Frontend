export function getMonday(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  return monday.toISOString().split('T')[0];
}

export function getSunday(mondayStr) {
  const d = new Date(mondayStr);
  d.setDate(d.getDate() + 6);
  return d.toISOString().split('T')[0];
}

export function getPastWeeks(count = 8) {
  const weeks = [];
  const now = new Date();
  let currentMonday = new Date(getMonday(now));

  for (let i = 0; i < count; i++) {
    const startStr = currentMonday.toISOString().split('T')[0];
    const sunday = new Date(currentMonday);
    sunday.setDate(sunday.getDate() + 6);
    const endStr = sunday.toISOString().split('T')[0];

    const label = i === 0 
      ? `Current Week (${startStr} → ${endStr})`
      : `${startStr} → ${endStr}`;

    weeks.push({
      start: startStr,
      end: endStr,
      label
    });

    currentMonday.setDate(currentMonday.getDate() - 7);
  }
  return weeks;
}

export const PAST_WEEKS = getPastWeeks(8);
export const CURRENT_WEEK = PAST_WEEKS[0];
