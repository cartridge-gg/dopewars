import { Game, GameEdge, useGameByIdQuery, useRegisteredGamesBySeasonQuery } from "@/generated/graphql";
import { useMemo } from "react";

export interface RegisteredGamesBySeasonInterface {
  registeredGames: Game[];
  isFetched: boolean;
}

export const useRegisteredGamesBySeason = (version: number): RegisteredGamesBySeasonInterface => {
  const { data, isFetched } = useRegisteredGamesBySeasonQuery({
    version,
  });

  const registeredGames = useMemo(() => {
    const edges = data?.gameModels?.edges as GameEdge[];
    return edges?.length > 0 ? edges.map((i) => i.node as Game) : [];
  }, [data]);

  return {
    registeredGames,
    isFetched,
  };
};
