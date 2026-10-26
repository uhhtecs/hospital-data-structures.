export const METRICS = [
  { key: 'points_per_game', label: 'PPG', full: 'Points', max: 35 },
  { key: 'rebounds_per_game', label: 'RPG', full: 'Rebounds', max: 13 },
  { key: 'assists_per_game', label: 'APG', full: 'Assists', max: 11 },
  { key: 'steals_per_game', label: 'SPG', full: 'Steals', max: 2.5 },
  { key: 'blocks_per_game', label: 'BPG', full: 'Blocks', max: 2 },
  { key: 'field_goal_pct', label: 'FG%', full: 'Field Goal', max: 65, isPct: true },
  { key: 'three_point_pct', label: '3P%', full: 'Three Point', max: 45, isPct: true },
  { key: 'free_throw_pct', label: 'FT%', full: 'Free Throw', max: 95, isPct: true },
  { key: 'minutes_per_game', label: 'MPG', full: 'Minutes', max: 40 },
];

export const SORTABLE_COLS = [
  { key: 'name', label: 'Player' },
  { key: 'team', label: 'Team', short: true },
  { key: 'position', label: 'Pos', short: true, hideMobile: true },
  { key: 'points_per_game', label: 'PPG', numeric: true },
  { key: 'rebounds_per_game', label: 'RPG', numeric: true, hideMobile: true },
  { key: 'assists_per_game', label: 'APG', numeric: true, hideMobile: true },
  { key: 'steals_per_game', label: 'STL', numeric: true, hideMobile: true },
  { key: 'field_goal_pct', label: 'FG%', numeric: true, hideMobile: true },
  { key: 'three_point_pct', label: '3P%', numeric: true, hideMobile: true },
  { key: 'minutes_per_game', label: 'MIN', numeric: true, hideMobile: true },
];

export function fmt(n, digits = 1) {
  if (n === null || n === undefined) return '—';
  return Number(n).toFixed(digits);
}

export function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function heightFmt(inches) {
  if (!inches) return '—';
  const ft = Math.floor(inches / 12);
  const inc = inches % 12;
  return `${ft}'${inc}"`;
}

export function winPct(wins, losses) {
  const total = wins + losses;
  if (!total) return 0;
  return wins / total;
}
