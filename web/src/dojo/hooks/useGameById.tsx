import { Dopewars_Game as Game, Dopewars_GameEdge as GameEdge, useGameByIdQuery } from "@/generated/graphql";
import { useMemo } from "react";

interface GameByIdInterface {
  game?: Game;
  isFetched: boolean;
}

export const useGameById = (gameId: number): GameByIdInterface => {
  const { data, isFetched } = useGameByIdQuery({
    gameId,
  });

  const game = useMemo(() => {
    const edges = data?.dopewarsGameModels?.edges as GameEdge[];
    return edges?.length > 0 ? (edges[0].node as Game) : undefined;
  }, [data]);

  return {
    game,
    isFetched,
  };
};
