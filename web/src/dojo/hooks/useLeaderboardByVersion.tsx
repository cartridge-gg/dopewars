import { Leaderboard, LeaderboardEdge, useLeaderboardByVersionQuery } from "@/generated/graphql";
import { useEffect, useMemo } from "react";
import { useDojoContext } from "./useDojoContext";

export type LeaderboardByVersionResult = ReturnType<typeof useLeaderboardByVersion>;

export const useLeaderboardByVersion = (version: number) => {
  const {
    chains: { selectedChain },
  } = useDojoContext();

  const { data, isFetching, isRefetching, isError, refetch } = useLeaderboardByVersionQuery({
    version,
  });

  useEffect(() => {
    refetch();
  }, [selectedChain.toriiUrl]);

  const leaderboard = useMemo<Leaderboard | undefined>(() => {
    if (isError || isFetching || isRefetching || !data) return undefined;

    const edges = data?.leaderboardModels?.edges as LeaderboardEdge[];
    return edges?.length > 0 ? (edges[0].node as Leaderboard) : undefined;
  }, [data, isFetching, isRefetching, isError]);

  return {
    leaderboard,
    isFetchingLeaderboard: isFetching || isRefetching,
    refetchLeaderboard: refetch,
  };
};
