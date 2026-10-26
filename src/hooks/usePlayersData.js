import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Fetch all players with their team and latest season stats in one query.
export function usePlayersData() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [playerRes, teamRes] = await Promise.all([
        supabase
          .from('players')
          .select(`
            id, name, position, number, height_in, weight_lb, years_experience, bio, photo_url,
            team:teams(id, name, city, abbreviation, conference, primary_color, secondary_color),
            stats:player_season_stats(season, games_played, points_per_game, rebounds_per_game, assists_per_game, steals_per_game, blocks_per_game, field_goal_pct, three_point_pct, free_throw_pct, minutes_per_game, turnovers_per_game)
          `),
        supabase.from('teams').select('*'),
      ]);

      if (playerRes.error) throw playerRes.error;
      if (teamRes.error) throw teamRes.error;

      const enriched = (playerRes.data || []).map((p) => {
        const stats = (p.stats || []).slice().sort((a, b) =>
          (b.season || '').localeCompare(a.season || '')
        )[0] || null;
        return { ...p, latestStats: stats };
      });

      setPlayers(enriched);
      setTeams(teamRes.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { players, teams, loading, error, reload: load };
}
