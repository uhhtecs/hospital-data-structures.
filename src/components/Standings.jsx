import { winPct } from '../lib/stats';

function ConfList({ teams, title, tag }) {
  const sorted = teams.slice().sort((a, b) => {
    const pa = winPct(a.wins, a.losses);
    const pb = winPct(b.wins, b.losses);
    if (pb !== pa) return pb - pa;
    return b.wins - a.wins;
  });

  const topPct = sorted[0] ? winPct(sorted[0].wins, sorted[0].losses) : 1;

  return (
    <div className="card standings-card">
      <div className="conf-head">
        <h3>{title}</h3>
        <span className="conf-tag">{tag}</span>
      </div>
      <div>
        {sorted.map((t, i) => {
          const pct = winPct(t.wins, t.losses);
          const barWidth = topPct ? (pct / topPct) * 100 : 0;
          return (
            <div className="standings-row" key={t.id}>
              <div className={`rank ${i < 8 ? 'top' : ''}`}>{i + 1}</div>
              <div className="team-name">
                <span className="abbr" style={{
                  background: t.primary_color,
                  color: pickTextColor(t.primary_color, t.secondary_color),
                }}>
                  {t.abbreviation}
                </span>
                <span className="hide-mobile">{t.city} {t.name}</span>
                <span style={{ display: 'none' }} className="show-mobile-inline">{t.abbreviation}</span>
              </div>
              <div className="pct">{(pct * 100).toFixed(1)}%</div>
              <div className="record">{t.wins}-{t.losses}</div>
              <div className="win-bar"><span style={{ width: `${barWidth}%` }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function pickTextColor(bg, fallback) {
  const hex = bg.replace('#', '');
  if (hex.length !== 6) return fallback || '#fff';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#111410' : '#ffffff';
}

export default function Standings({ teams }) {
  const east = teams.filter((t) => t.conference === 'East');
  const west = teams.filter((t) => t.conference === 'West');

  return (
    <div>
      <div className="section-head">
        <div>
          <p className="eyebrow">Standings</p>
          <h2 className="section-title">Conference <span>Race</span></h2>
          <p className="section-sub">Live win-loss records across the Eastern and Western conferences, sorted by win percentage.</p>
        </div>
      </div>
      <div className="standings-grid">
        <ConfList teams={east} title="Eastern" tag="Top 8 → Playoffs" />
        <ConfList teams={west} title="Western" tag="Top 8 → Playoffs" />
      </div>
    </div>
  );
}
