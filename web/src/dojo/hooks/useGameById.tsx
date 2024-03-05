import { Game, GameEdge, useGameByIdQuery } from "@/generated/graphql";
import { useMemo } from "react";

export interface GameByIdInterface {
  game?: Game;
  isFetched: boolean;
}

export const useGameById = (gameId: number): GameByIdInterface => {
  const { data, isFetched } = useGameByIdQuery({
    gameId,
  });

  const game = useMemo(() => {
    const edges = data?.gameModels?.edges as GameEdge[];
    return edges?.length > 0 ? (edges[0].node as Game) : undefined;
  }, [data]);

  return {
    game,
    isFetched,
  };
};
