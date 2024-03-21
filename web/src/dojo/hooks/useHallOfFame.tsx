import { Leaderboard, World__ModelEdge, useHallOfFameQuery } from "@/generated/graphql";
import { formatEther } from "@/utils/ui";
import { useEffect, useMemo } from "react";
import { useDojoContext } from "./useDojoContext";

export type HallOfFameResult = ReturnType<typeof useHallOfFame>;

export const useHallOfFame = () => {
  const {
    chains: {
      selectedChain
    },
  } = useDojoContext();

  const { data, isFetching, isRefetching, isError, refetch  } = useHallOfFameQuery({});

  useEffect(() => {
    refetch();
  }, [selectedChain.toriiUrl, refetch]);

  const hallOfFame = useMemo(() => {
    if (isError || isFetching || isRefetching || !data) return [];

    const edges = data.leaderboardModels?.edges as World__ModelEdge[];
    const nodes = edges.map((i: World__ModelEdge) => i.node as Leaderboard);

    return nodes
      .map((i: Leaderboard) => {
        return {
          ...i,
          paper_balance: formatEther(i.paper_balance),
        } as Leaderboard;
      })
      .sort((a, b) => a.version - b.version);
    }, [data, isFetching,isRefetching, isError]);

  return {
    hallOfFame,
    isFetchingHallOfFame: isFetching || isRefetching,
    refetchHallOfFame: refetch,
  };
};
