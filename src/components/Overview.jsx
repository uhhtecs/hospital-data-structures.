import { fmt } from '../lib/stats';

export default function Overview({ players, teams }) {
  const scored = players.filter((p) => p.latestStats);
  const totalPoints = scored.reduce((s, p) => s + Number(p.latestStats.points_per_game || 0), 0);
  const avgPpg = scored.length ? totalPoints / scored.length : 0;
  const topScorer = scored.slice().sort((a, b) => Number(b.latestStats.points_per_game) - Number(a.latestStats.points_per_game))[0];
  const topAssist = scored.slice().sort((a, b) => Number(b.latestStats.assists_per_game) - Number(a.latestStats.assists_per_game))[0];
  const topBoard = scored.slice().sort((a, b) => Number(b.latestStats.rebounds_per_game) - Number(a.latestStats.rebounds_per_game))[0];

  const tiles = [
    { label: 'Players Tracked', value: scored.length, sub: <span>Across <b>{teams.length}</b> teams</span> },
    { label: 'Avg Points / Game', value: fmt(avgPpg), sub: <span>Roster-wide PPG</span> },
    { label: 'Top Scorer', value: topScorer ? fmt(topScorer.latestStats.points_per_game) : '—', sub: <span>{topScorer?.name}</span> },
    { label: 'Top Playmaker', value: topAssist ? fmt(topAssist.latestStats.assists_per_game) : '—', sub: <span>{topAssist?.name}</span> },
  ];

  return (
    <div>
      <div className="section-head">
        <div>
          <p className="eyebrow">2023-24 Season Snapshot</p>
          <h2 className="section-title">The <span>Overview</span></h2>
          <p className="section-sub">A quick read on the league leaders across the roster of players we track.</p>
        </div>
      </div>

      <div className="stat-grid">
        {tiles.map((t) => (
          <div className="stat-tile" key={t.label}>
            <div className="label">{t.label}</div>
            <div className="value">{t.value}</div>
            <div className="sub">{t.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <LeaderCard title="Scoring Leader" player={topScorer} metric="points_per_game" unit="PPG" />
        <LeaderCard title="Rebound Leader" player={topBoard} metric="rebounds_per_game" unit="RPG" />
        <LeaderCard title="Assist Leader" player={topAssist} metric="assists_per_game" unit="APG" />
      </div>
    </div>
  );
}

function LeaderCard({ title, player, metric, unit }) {
  if (!player) return null;
  const v = player.latestStats?.[metric];
  return (
    <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: 'linear-gradient(135deg, var(--primary), var(--primary-600))',
        display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: '#171410',
        flexShrink: 0,
      }}>
        {player.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--text-dim)' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, lineHeight: 1.1, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {player.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {player.team ? `${player.team.city} ${player.team.name}` : 'Free Agent'}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: 'var(--primary)', lineHeight: 1 }}>{fmt(v)}</div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: 1 }}>{unit}</div>
      </div>
    </div>
  );
}
