import { Dopewars_V0_Game as Game, Dopewars_V0_GameEdge as GameEdge, useGameByIdQuery } from "@/generated/graphql";
import { useMemo } from "react";
import { DW_GRAPHQL_MODEL_NS } from "../constants";

interface GameByIdInterface {
  game?: Game;
  isFetched: boolean;
}

export const useGameById = (gameId: number): GameByIdInterface => {
  const { data, isFetched } = useGameByIdQuery({
    gameId,
  });

  const game = useMemo(() => {
    const edges = data?.[`${DW_GRAPHQL_MODEL_NS}GameModels`]?.edges as GameEdge[];
    return edges?.length > 0 ? (edges[0].node as Game) : undefined;
  }, [data]);

  return {
    game,
    isFetched,
  };
};
