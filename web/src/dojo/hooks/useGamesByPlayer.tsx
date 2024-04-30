import { Game, GameEdge, useGamesByPlayerQuery } from "@/generated/graphql";
import { useMemo } from "react";

export interface GamesByPlayerInterface {
  games: Game[];
  onGoingGames: Game[];
  endedGames: Game[];
  isFetched: boolean;
}

export const useGamesByPlayer = (playerId: string): GamesByPlayerInterface => {
  const { data, isFetched } = useGamesByPlayerQuery({
    playerId,
  });

  const games = useMemo(() => {
    const edges = data?.gameModels?.edges as GameEdge[];
    return (edges || []).map((i) => i.node as Game);
  }, [data]);

  const onGoingGames = useMemo(() => {
    return games.filter((i: Game) => !i.game_over);
  }, [games]);

  const endedGames = useMemo(() => {
    return games.filter((i: Game) => i.game_over);
  }, [games]);

  return {
    games: games || [],
    onGoingGames: onGoingGames || [],
    endedGames: endedGames || [],
    isFetched,
  };
};
