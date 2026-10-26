import { useState, useEffect } from 'react';
import { usePlayersData } from './hooks/usePlayersData';
import Overview from './components/Overview';
import PlayersTable from './components/PlayersTable';
import Standings from './components/Standings';
import CompareTool from './components/CompareTool';
import PlayerProfile from './components/PlayerProfile';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'players', label: 'Players' },
  { id: 'standings', label: 'Standings' },
  { id: 'compare', label: 'Compare' },
];

export default function App() {
  const { players, teams, loading, error } = usePlayersData();
  const [tab, setTab] = useState('overview');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (selectedPlayer) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPlayer]);

  const handleSelect = (p) => {
    setSelectedPlayer(p);
    setTab('profile');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="brand" onClick={(e) => { e.preventDefault(); setSelectedPlayer(null); setTab('overview'); }}>
            <span className="brand-mark">P</span>
            The <span>Paint</span>
          </a>
          <nav className="nav">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? 'active' : ''}
                onClick={() => { setSelectedPlayer(null); setTab(t.id); }}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {tab === 'overview' && !selectedPlayer && (
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">NBA Analyst Dashboard</p>
              <h1>Read<br />The <span>Game.</span></h1>
              <p className="lead">
                Player stats, team standings, and head-to-head comparisons —
                a clean desk for anyone who likes to break down basketball beyond the box score.
              </p>
              <div className="hero-meta">
                <div className="hero-meta-item"><strong>{players.length}</strong><span>Players</span></div>
                <div className="hero-meta-item"><strong>{teams.length}</strong><span>Teams</span></div>
                <div className="hero-meta-item"><strong>9</strong><span>Stat Categories</span></div>
                <div className="hero-meta-item"><strong>2</strong><span>Conferences</span></div>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-court" />
              <div className="hero-card-lines" />
              <div className="hero-card-content">
                <span className="pill">2023-24 Season</span>
                <h3>Where Stats<br />Tell The Story</h3>
                <p>Sort. Filter. Compare. Decide.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className={`container main ${selectedPlayer ? '' : 'shake-on-load'}`}>
        {error && <div className="error-box">Couldn't load data: {error}</div>}

        {loading ? (
          <div className="state-box">
            <div className="spinner" />
            Loading the latest stats…
          </div>
        ) : selectedPlayer ? (
          <PlayerProfile player={selectedPlayer} onBack={() => { setSelectedPlayer(null); setTab('players'); }} />
        ) : tab === 'overview' ? (
          <Overview players={players} teams={teams} />
        ) : tab === 'players' ? (
          <div>
            <div className="section-head">
              <div>
                <p className="eyebrow">Player Rankings</p>
                <h2 className="section-title">The <span>Stat Sheet</span></h2>
                <p className="section-sub">Click any column to sort. Search by player or team, filter by position. Tap a row for the full profile.</p>
              </div>
            </div>
            <PlayersTable players={players} onSelect={handleSelect} />
          </div>
        ) : tab === 'standings' ? (
          <Standings teams={teams} />
        ) : tab === 'compare' ? (
          <div>
            <div className="section-head">
              <div>
                <p className="eyebrow">Head To Head</p>
                <h2 className="section-title">Player <span>Matchup</span></h2>
                <p className="section-sub">Pick two players and compare across nine categories. The card that wins more categories lights up.</p>
              </div>
            </div>
            <CompareTool players={players} />
          </div>
        ) : null}
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>The Paint · Built for basketball fans</span>
          <span>Stats based on 2023-24 NBA regular season · For analysis purposes</span>
        </div>
      </footer>
    </div>
  );
}
