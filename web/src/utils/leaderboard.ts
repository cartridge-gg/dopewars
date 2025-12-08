export type LeaderboardEntryType = "registered" | "active";

export type LeaderboardEntry = {
  type: LeaderboardEntryType;
  game_id: number;
  player_id: string;
  player_name: string;
  score: number;
  position: number;
  registeredPosition?: number; // Position among registered games only (undefined for active games)
  claimable: number;
  multiplier: number;
  token_id_type?: string;
  token_id?: number;
  season_version: number;
};

// Type for games as returned by useRegisteredGamesBySeason/useActiveGamesBySeason
// which transforms player_name to string and adds token_id_type
export type GameFromSql = {
  game_id: number;
  player_id: string;
  player_name: string;
  final_score: number;
  claimable: number;
  multiplier: number;
  token_id_type?: string;
  token_id?: number;
  season_version: number;
  position: number;
};

// Map of game_id to actual cash value for active games (from GameClass.player.cash)
export type ActiveGameCashMap = Map<number, number>;

export const mergeLeaderboardEntries = (
  registeredGames: unknown[],
  activeGames: unknown[],
  currentUserAddress: string,
  activeGameCashMap?: ActiveGameCashMap,
): LeaderboardEntry[] => {
  const registeredEntries: LeaderboardEntry[] = (registeredGames as GameFromSql[]).map((game, index) => ({
    type: "registered" as const,
    game_id: game.game_id,
    player_id: game.player_id,
    player_name: game.player_name || "Anonymous",
    score: game.final_score,
    position: index + 1,
    registeredPosition: index + 1, // Position among registered games (preserved after merge)
    claimable: game.claimable,
    multiplier: game.multiplier,
    token_id_type: game.token_id_type,
    token_id: game.token_id,
    season_version: game.season_version,
  }));

  // Filter out active games that are already registered (to avoid duplicates)
  const registeredGameIds = new Set(registeredEntries.map((e) => e.game_id));

  const activeEntries: LeaderboardEntry[] = (activeGames as GameFromSql[])
    .filter((game) => !registeredGameIds.has(game.game_id))
    .map((game) => {
      // Use actual cash from GameClass if available, otherwise fall back to final_score
      const actualCash = activeGameCashMap?.get(game.game_id);
      return {
        type: "active" as const,
        game_id: game.game_id,
        player_id: game.player_id,
        player_name: game.player_name || "Anonymous",
        score: actualCash !== undefined ? actualCash : game.final_score,
        position: 0,
        claimable: 0,
        multiplier: game.multiplier,
        token_id_type: game.token_id_type,
        token_id: game.token_id,
        season_version: game.season_version,
      };
    });

  const allEntries = [...registeredEntries, ...activeEntries];

  allEntries.sort((a, b) => b.score - a.score);

  return allEntries.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));
};
