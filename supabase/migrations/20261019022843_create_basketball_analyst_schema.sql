/*
# Basketball Analyst Schema

1. New Tables
- `teams`: NBA teams with conference, division, city, colors, wins/losses.
- `players`: NBA players with position, height, weight, team reference, bio, photo URL.
- `player_season_stats`: Per-player season averages (PPG, RPG, APG, etc.) keyed by season label.
2. Security
- Single-tenant public app (no sign-in). RLS enabled on every table with anon+authenticated full CRUD so the frontend anon client can read all data.
3. Important Notes
- All data is intentionally public/shared (read-only analyst dashboard).
- Team standings computed live from teams.wins / teams.losses.
*/

CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  abbreviation text NOT NULL UNIQUE,
  conference text NOT NULL,
  division text NOT NULL,
  wins int NOT NULL DEFAULT 0,
  losses int NOT NULL DEFAULT 0,
  primary_color text NOT NULL DEFAULT '#1d428a',
  secondary_color text NOT NULL DEFAULT '#ffffff',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  position text NOT NULL,
  number int,
  height_in int,
  weight_lb int,
  years_experience int,
  bio text,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_season_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season text NOT NULL,
  games_played int NOT NULL DEFAULT 0,
  points_per_game numeric(5,1) NOT NULL DEFAULT 0,
  rebounds_per_game numeric(5,1) NOT NULL DEFAULT 0,
  assists_per_game numeric(5,1) NOT NULL DEFAULT 0,
  steals_per_game numeric(5,1) NOT NULL DEFAULT 0,
  blocks_per_game numeric(5,1) NOT NULL DEFAULT 0,
  field_goal_pct numeric(4,1) NOT NULL DEFAULT 0,
  three_point_pct numeric(4,1) NOT NULL DEFAULT 0,
  free_throw_pct numeric(4,1) NOT NULL DEFAULT 0,
  minutes_per_game numeric(5,1) NOT NULL DEFAULT 0,
  turnovers_per_game numeric(5,1) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (player_id, season)
);

CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_stats_player ON player_season_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_stats_season ON player_season_stats(season);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_season_stats ENABLE ROW LEVEL SECURITY;

-- teams: public read/write
DROP POLICY IF EXISTS "anon_select_teams" ON teams;
CREATE POLICY "anon_select_teams" ON teams FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_teams" ON teams;
CREATE POLICY "anon_insert_teams" ON teams FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_teams" ON teams;
CREATE POLICY "anon_update_teams" ON teams FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_teams" ON teams;
CREATE POLICY "anon_delete_teams" ON teams FOR DELETE TO anon, authenticated USING (true);

-- players: public read/write
DROP POLICY IF EXISTS "anon_select_players" ON players;
CREATE POLICY "anon_select_players" ON players FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_players" ON players;
CREATE POLICY "anon_insert_players" ON players FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_players" ON players;
CREATE POLICY "anon_update_players" ON players FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_players" ON players;
CREATE POLICY "anon_delete_players" ON players FOR DELETE TO anon, authenticated USING (true);

-- player_season_stats: public read/write
DROP POLICY IF EXISTS "anon_select_stats" ON player_season_stats;
CREATE POLICY "anon_select_stats" ON player_season_stats FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_stats" ON player_season_stats;
CREATE POLICY "anon_insert_stats" ON player_season_stats FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_stats" ON player_season_stats;
CREATE POLICY "anon_update_stats" ON player_season_stats FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_stats" ON player_season_stats;
CREATE POLICY "anon_delete_stats" ON player_season_stats FOR DELETE TO anon, authenticated USING (true);
