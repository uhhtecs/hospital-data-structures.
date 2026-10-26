import { useState } from 'react';
import { METRICS, fmt, initials, heightFmt } from '../lib/stats';

export default function CompareTool({ players }) {
  const scored = players.filter((p) => p.latestStats);
  const [aId, setAId] = useState(scored[0]?.id || '');
  const [bId, setBId] = useState(scored[1]?.id || '');

  const a = scored.find((p) => p.id === aId) || null;
  const b = scored.find((p) => p.id === bId) || null;

  if (scored.length < 2) {
    return <div className="state-box">Need at least two players with stats to compare.</div>;
  }

  const winsA = METRICS.reduce((acc, m) => {
    if (!a || !b) return acc;
    const av = Number(a.latestStats?.[m.key] ?? 0);
    const bv = Number(b.latestStats?.[m.key] ?? 0);
    return acc + (av > bv ? 1 : 0);
  }, 0);
  const winsB = METRICS.length - winsA - (a && b ? 0 : 0);
  // recompute ties properly
  let ties = 0;
  let realWinsA = 0;
  let realWinsB = 0;
  METRICS.forEach((m) => {
    if (!a || !b) return;
    const av = Number(a.latestStats?.[m.key] ?? 0);
    const bv = Number(b.latestStats?.[m.key] ?? 0);
    if (av === bv) ties++;
    else if (av > bv) realWinsA++;
    else realWinsB++;
  });

  return (
    <div>
      <div className="compare-picker">
        <select value={aId} onChange={(e) => setAId(e.target.value)}>
          {scored.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <span className="vs">VS</span>
        <select value={bId} onChange={(e) => setBId(e.target.value)}>
          {scored.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="compare-layout">
        <CompareCard player={a} wins={realWinsA} isWinner={realWinsA > realWinsB && a && b} other={b} side="a" />
        <CompareCard player={b} wins={realWinsB} isWinner={realWinsB > realWinsA && a && b} other={a} side="b" />
      </div>

      {ties > 0 && (
        <p style={{ marginTop: 16, color: 'var(--text-dim)', fontSize: 12 }}>
          {ties} categor{ties === 1 ? 'y' : 'ies'} tied.
        </p>
      )}
    </div>
  );
}

function CompareCard({ player, wins, isWinner }) {
  if (!player) return <div className="card compare-card">Select a player.</div>;
  const s = player.latestStats;

  return (
    <div className={`card compare-card ${isWinner ? 'winner' : ''}`}>
      <div className="compare-head">
        <div className="avatar-lg">{initials(player.name)}</div>
        <div>
          <h3>{player.name}</h3>
          <div className="meta">
            {player.team ? `${player.team.abbreviation}` : 'FA'} · {player.position} · {heightFmt(player.height_in)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: '8px' }}>
        <span style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-dim)' }}>Categories Won</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: isWinner ? 'var(--primary)' : 'var(--text)' }}>
          {wins}<span style={{ color: 'var(--text-dim)', fontSize: 14 }}> / {METRICS.length}</span>
        </span>
      </div>

      {METRICS.map((m) => {
        const v = Number(s?.[m.key] ?? 0);
        const pctWidth = Math.min(100, (v / m.max) * 100);
        return (
          <div key={m.key} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-dim)' }}>{m.full}</span>
              <span className="num-cell" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>
                {m.isPct ? `${fmt(v, 1)}%` : fmt(v, 1)}
              </span>
            </div>
            <div className="bar-track" style={{ height: 6, background: 'var(--surface-3)', borderRadius: 999, overflow: 'hidden' }}>
              <div className="bar-fill" style={{ width: `${pctWidth}%`, height: '100%', background: isWinner ? 'var(--primary)' : 'var(--text-dim)', borderRadius: 999 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
