import { Leaderboard, LeaderboardEdge, useLeaderboardByVersionQuery } from "@/generated/graphql";
import { useMemo } from "react";

export interface LeaderboardsInterface {
  leaderboard?: Leaderboard;
  isFetched: boolean;
}

export const useLeaderboards = (version: number): LeaderboardsInterface => {
  const { data, isFetched } = useLeaderboardByVersionQuery({
    version,
  });

  const leaderboard = useMemo(() => {
    const edges = data?.leaderboardModels?.edges as LeaderboardEdge[];
    return edges?.length > 0 ? (edges[0].node as Leaderboard) : undefined;
  }, [data]);

  return {
    leaderboard,
    isFetched,
  };
};
