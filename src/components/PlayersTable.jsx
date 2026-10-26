import { useState, useMemo } from 'react';
import { SORTABLE_COLS, fmt, initials } from '../lib/stats';

const POSITIONS = ['All', 'PG', 'SG', 'SF', 'PF', 'C'];

export default function PlayersTable({ players, onSelect }) {
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState('All');
  const [sortKey, setSortKey] = useState('points_per_game');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    let list = players.filter((p) => p.latestStats);
    if (pos !== 'All') list = list.filter((p) => p.position === pos);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.team && (`${p.team.city} ${p.team.name}`).toLowerCase().includes(q)) ||
        (p.team && p.team.abbreviation.toLowerCase().includes(q))
      );
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    list = list.slice().sort((a, b) => {
      let av, bv;
      if (sortKey === 'name') { av = a.name; bv = b.name; return av.localeCompare(bv) * dir; }
      if (sortKey === 'team') { av = a.team?.abbreviation || ''; bv = b.team?.abbreviation || ''; return av.localeCompare(bv) * dir; }
      if (sortKey === 'position') { av = a.position; bv = b.position; return av.localeCompare(bv) * dir; }
      av = Number(a.latestStats?.[sortKey] ?? 0);
      bv = Number(b.latestStats?.[sortKey] ?? 0);
      return (av - bv) * dir;
    });
    return list;
  }, [players, query, pos, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'team' || key === 'position' ? 'asc' : 'desc');
    }
  };

  const getVal = (p, key) => {
    if (key === 'name') return p.name;
    if (key === 'team') return p.team?.abbreviation || '—';
    if (key === 'position') return p.position;
    const v = p.latestStats?.[key];
    if (v === null || v === undefined) return '—';
    return key.includes('pct') ? `${fmt(v, 1)}%` : fmt(v, 1);
  };

  return (
    <div className="table-wrap">
      <div className="table-toolbar">
        <div className="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search players or teams…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {POSITIONS.map((p) => (
            <button
              key={p}
              className={`chip ${pos === p ? 'active' : ''}`}
              onClick={() => setPos(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              {SORTABLE_COLS.map((col) => (
                <th
                  key={col.key}
                  className={`sortable ${sortKey === col.key ? 'sorted' : ''} ${col.hideMobile ? 'hide-mobile' : ''}`}
                  onClick={() => toggleSort(col.key)}
                  style={col.numeric ? { textAlign: 'right' } : undefined}
                >
                  {col.label}
                  <span className="arrow">{sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={SORTABLE_COLS.length} style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)' }}>No players match your search.</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} onClick={() => onSelect(p)}>
                <td>
                  <div className="player-cell">
                    <div className="player-avatar">{initials(p.name)}</div>
                    <div className="name-block">
                      <strong>{p.name}</strong>
                      <span>{p.team ? `${p.team.abbreviation} · ${p.position}` : p.position}</span>
                    </div>
                  </div>
                </td>
                <td>
                  {p.team && (
                    <span className="team-badge">
                      <span className="dot" style={{ background: p.team.primary_color }} />
                      {p.team.abbreviation}
                    </span>
                  )}
                </td>
                <td className={p.position.length > 2 ? '' : 'num-cell'} style={{ textAlign: 'center' }}>{p.position}</td>
                {SORTABLE_COLS.slice(3).map((col) => (
                  <td
                    key={col.key}
                    className="num-cell"
                    style={{ textAlign: 'right' }}
                  >
                    {getVal(p, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
