import { fmt, initials, heightFmt } from '../lib/stats';

export default function PlayerProfile({ player, onBack }) {
  const s = player.latestStats;
  const team = player.team;

  return (
    <div>
      <button className="profile-back" onClick={onBack}>← Back to rankings</button>

      <div className="profile-grid">
        <aside className="profile-side">
          <div className="card">
            <div className="profile-card-top">
              <div className="big-avatar">{initials(player.name)}</div>
              <h2>{player.name}</h2>
              <div className="team-line">
                {team ? `${team.city} ${team.name}` : 'Free Agent'} · #{player.number ?? '—'}
              </div>
              <span className="pos-pill">{player.position}</span>
            </div>

            {player.bio && (
              <div className="profile-bio">
                <p>{player.bio}</p>
              </div>
            )}

            <div className="profile-attr-list">
              <div className="attr"><span>Height</span><strong>{heightFmt(player.height_in)}</strong></div>
              <div className="attr"><span>Weight</span><strong>{player.weight_lb ? `${player.weight_lb} lb` : '—'}</strong></div>
              <div className="attr"><span>Experience</span><strong>{player.years_experience ?? '—'} yrs</strong></div>
              {s && <div className="attr"><span>Season</span><strong>{s.season}</strong></div>}
              {s && <div className="attr"><span>Games</span><strong>{s.games_played}</strong></div>}
            </div>
          </div>
        </aside>

        <div>
          {s ? (
            <>
              <div className="section-head" style={{ marginBottom: 18 }}>
                <div>
                  <p className="eyebrow">Season Averages · {s.season}</p>
                  <h2 className="section-title">Stat <span>Profile</span></h2>
                </div>
              </div>

              <div className="stat-cards">
                <div className="stat-card">
                  <div className="m">Points</div>
                  <div className="v">{fmt(s.points_per_game)}<span className="u">/gm</span></div>
                </div>
                <div className="stat-card">
                  <div className="m">Rebounds</div>
                  <div className="v">{fmt(s.rebounds_per_game)}<span className="u">/gm</span></div>
                </div>
                <div className="stat-card">
                  <div className="m">Assists</div>
                  <div className="v">{fmt(s.assists_per_game)}<span className="u">/gm</span></div>
                </div>
                <div className="stat-card">
                  <div className="m">Steals</div>
                  <div className="v">{fmt(s.steals_per_game)}<span className="u">/gm</span></div>
                </div>
                <div className="stat-card">
                  <div className="m">Blocks</div>
                  <div className="v">{fmt(s.blocks_per_game)}<span className="u">/gm</span></div>
                </div>
                <div className="stat-card">
                  <div className="m">Minutes</div>
                  <div className="v">{fmt(s.minutes_per_game)}<span className="u">/gm</span></div>
                </div>
              </div>

              <div className="card card-pad shooting-bars">
                <div className="eyebrow" style={{ marginBottom: 14 }}>Shooting Splits</div>
                {[
                  { lbl: 'Field Goal', v: s.field_goal_pct, max: 65 },
                  { lbl: 'Three Point', v: s.three_point_pct, max: 45 },
                  { lbl: 'Free Throw', v: s.free_throw_pct, max: 95 },
                ].map((row) => (
                  <div className="shoot-row" key={row.lbl}>
                    <div className="lbl">{row.lbl}</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.min(100, (row.v / row.max) * 100)}%` }} />
                    </div>
                    <div className="val">{fmt(row.v, 1)}%</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="state-box">No season stats available for this player.</div>
          )}
        </div>
      </div>
    </div>
  );
}
