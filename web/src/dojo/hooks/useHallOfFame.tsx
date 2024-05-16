import { Game, Season, World__ModelEdge, useHallOfFameQuery } from "@/generated/graphql";
import { useEffect, useMemo } from "react";
import { useDojoContext } from "./useDojoContext";

export type HallOfFameResult = ReturnType<typeof useHallOfFame>;

export const useHallOfFame = () => {
  const {
    chains: { selectedChain },
  } = useDojoContext();

  const { data, isFetching, isRefetching, isError, refetch } = useHallOfFameQuery({});

  useEffect(() => {
    refetch();
  }, [selectedChain.toriiUrl, refetch]);

  const hallOfFame = useMemo(() => {
    if (isError || isFetching || isRefetching || !data) return [];

    const edges = data.gameModels?.edges as World__ModelEdge[];
    return edges.map((i: World__ModelEdge) => i.node as Game);
  }, [data, isFetching, isRefetching, isError]);

  return {
    hallOfFame,
    isFetchingHallOfFame: isFetching || isRefetching,
    refetchHallOfFame: refetch,
  };
};
