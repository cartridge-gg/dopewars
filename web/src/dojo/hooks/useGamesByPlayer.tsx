import {
  Game,
  GameConfig,
  GameEdge,
  GameStorePacked,
  Maybe,
  SeasonSettings,
  World__Entity,
  World__EntityEdge,
  useAllGameConfigQuery,
  useAllSeasonSettingsQuery,
  useGamesByPlayerQuery,
} from "@/generated/graphql";
import { useMemo } from "react";
import { GameClass } from "../class/Game";
import { useDojoContext } from "./useDojoContext";

export interface GamesByPlayerInterface {
  games: GameClass[];
  onGoingGames: GameClass[];
  endedGames: GameClass[];
  isFetched: boolean;
}


// TODO : change to get games by player by Season
export const useGamesByPlayer = (playerId: string): GamesByPlayerInterface => {
  const { data, isFetched } = useGamesByPlayerQuery({
    playerId,
  });

  const { data: allSeasonSettings } = useAllSeasonSettingsQuery({});
  const { data: allGameConfig } = useAllGameConfigQuery({});

  const { configStore } = useDojoContext();

  const games = useMemo(() => {
    if (!data || !allGameConfig || !allSeasonSettings) return [];

    const edges = data?.entities?.edges as World__EntityEdge[];
    const nodes = (edges || []).map((i) => i.node);

    const games = nodes.flatMap((i) => {
      const gameInfos = (i!.models || []).find((i) => i?.__typename === "Game") as Game;
      const gameStorePacked = (i!.models || []).find((i) => i?.__typename === "GameStorePacked") as GameStorePacked;

      if (!gameInfos || !gameStorePacked) return [];

      const seasonSettings = allSeasonSettings?.seasonSettingsModels?.edges?.find(
        (i) => i?.node?.season_version === gameInfos.season_version,
      )?.node as SeasonSettings;

      const gameConfig = allGameConfig?.gameConfigModels?.edges?.find(
        (i) => i?.node?.season_version === gameInfos.season_version,
      )?.node as GameConfig;

      return [new GameClass(configStore, gameInfos, seasonSettings, gameConfig, gameStorePacked)];
    });

    return games;
    return [];
  }, [data, allSeasonSettings, allGameConfig]);

  const onGoingGames = useMemo(() => {
    return games.filter((i: GameClass) => !i.gameInfos.game_over);
  }, [games]);

  const endedGames = useMemo(() => {
    return games.filter((i: GameClass) => i.gameInfos.game_over);
  }, [games]);

  return {
    games: games || [],
    onGoingGames: onGoingGames || [],
    endedGames: endedGames || [],
    isFetched,
  };
};
