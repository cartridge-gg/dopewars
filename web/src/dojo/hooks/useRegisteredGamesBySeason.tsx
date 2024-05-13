import { Game, GameEdge, useGameByIdQuery, useRegisteredGamesBySeasonQuery } from "@/generated/graphql";
import { useMemo } from "react";

export interface RegisteredGamesBySeasonInterface {
  registeredGames: Game[];
  isFetched: boolean;
  isFetching: boolean;
  refetch: any;
}

export const useRegisteredGamesBySeason = (version: number): RegisteredGamesBySeasonInterface => {
  const { data, isFetched, isFetching, refetch } = useRegisteredGamesBySeasonQuery({
    version,
  });

  const registeredGames = useMemo(() => {
    const edges = data?.gameModels?.edges as GameEdge[];
    const games = edges?.length > 0 ? edges.map((i) => i.node as Game) : [];
    return games.sort((a: Game, b: Game) => {
      const bPos = b.position > 0 ? (9999 - b.position) * 1_000_000_000 : 0;
      const aPos = a.position > 0 ? (9999 - a.position) * 1_000_000_000 : 0;
      return bPos + b.final_score - (aPos + a.final_score);
    });
  }, [data]);

  return {
    registeredGames,
    isFetched,
    isFetching,
    refetch,
  };
};
