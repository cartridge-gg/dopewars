import { GameClass } from "@/dojo/class/Game";
import { shortString } from "starknet";

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
export type RegisteredGame = {
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
  // registeredGames type is declared as Dopewars_V0_Game[] by the hook but is transformed
  // to include player_name (decoded), token_id_type, etc. We use unknown[] for flexibility.
  registeredGames: unknown[],
  activeGames: GameClass[],
  _currentUserAddress: string,
): LeaderboardEntry[] => {
  const registeredEntries: LeaderboardEntry[] = (registeredGames as RegisteredGame[]).map((game, index) => ({
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

  const activeEntries: LeaderboardEntry[] = activeGames.map((game) => {
    // Extract token_id info - gameInfos.token_id is a union type from GraphQL
    const tokenIdObj = game.gameInfos.token_id as { option?: string; [key: string]: unknown } | undefined;
    const tokenIdType = tokenIdObj?.option;
    const tokenId = tokenIdType ? Number(tokenIdObj[tokenIdType]) : undefined;

    // player_name is Dopewars_V0_Bytes16 type with a value property containing the felt
    const playerNameObj = game.gameInfos.player_name;
    const playerNameValue = playerNameObj?.value;
    const playerName = playerNameValue
      ? shortString.decodeShortString(BigInt(playerNameValue).toString())
      : "Anonymous";

    return {
      type: "active" as const,
      game_id: game.gameInfos.game_id,
      player_id: game.gameInfos.player_id,
      player_name: playerName,
      score: game.player.cash,
      position: 0,
      claimable: 0,
      multiplier: game.gameInfos.multiplier,
      token_id_type: tokenIdType,
      token_id: tokenId,
      season_version: game.gameInfos.season_version,
      gameRef: game,
    };
  });

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
