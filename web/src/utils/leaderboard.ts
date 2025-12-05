import { GameClass } from "@/dojo/class/Game";

export type LeaderboardEntryType = "registered" | "active";

export type LeaderboardEntry = {
  type: LeaderboardEntryType;
  game_id: number;
  player_id: string;
  player_name: string;
  score: number;
  position: number;
  claimable: number;
  multiplier: number;
  token_id_type?: string;
  token_id?: number;
  season_version: number;
  gameRef?: GameClass;
};

// Extended type for registered games as returned by useRegisteredGamesBySeason
// which transforms player_name to string and adds token_id_type
type RegisteredGame = {
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

export const mergeLeaderboardEntries = (
  // Using any[] because useRegisteredGamesBySeason transforms the data
  // but returns the original Dopewars_V0_Game type
  registeredGames: any[],
  activeGames: GameClass[],
  currentUserAddress: string,
): LeaderboardEntry[] => {
  const registeredEntries: LeaderboardEntry[] = registeredGames.map((game, index) => ({
    type: "registered" as const,
    game_id: game.game_id,
    player_id: game.player_id,
    player_name: game.player_name || "Anonymous",
    score: game.final_score,
    position: index + 1,
    claimable: game.claimable,
    multiplier: game.multiplier,
    token_id_type: game.token_id_type,
    token_id: game.token_id,
    season_version: game.season_version,
  }));

  const activeEntries: LeaderboardEntry[] = activeGames.map((game) => ({
    type: "active" as const,
    game_id: game.gameInfos.game_id,
    player_id: game.gameInfos.player_id,
    player_name: (game.gameInfos.player_name as string) || "Anonymous",
    score: game.player.cash,
    position: 0,
    claimable: 0,
    multiplier: game.gameInfos.multiplier,
    token_id_type: (game.gameInfos as any).token_id_type,
    token_id: (game.gameInfos as any).token_id,
    season_version: game.gameInfos.season_version,
    gameRef: game,
  }));

  const allEntries = [...registeredEntries, ...activeEntries];

  allEntries.sort((a, b) => b.score - a.score);

  return allEntries.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));
};

export const getActiveGamesForSeason = (
  onGoingGames: GameClass[],
  seasonVersion: number,
): GameClass[] => {
  return onGoingGames.filter(
    (game) => game.gameInfos.season_version === seasonVersion,
  );
};
