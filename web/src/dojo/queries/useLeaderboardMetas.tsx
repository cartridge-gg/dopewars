import { Leaderboard, LeaderboardEdge, useLeaderboardMetasQuery } from "@/generated/graphql";
import { useMemo } from "react";
import { REFETCH_INTERVAL } from "../constants";

export class LeaderboardMetas {
  static create(edges: LeaderboardEdge[]): Leaderboard | undefined {
    if (!edges || edges.length === 0) return undefined;
    return edges[0].node as Leaderboard;
  }
}

export interface LeaderboardMetasInterface {
  leaderboardMetas?: Leaderboard;
  isFetched: boolean;
}

export const useLeaderboardMetas = (version: number): LeaderboardMetasInterface => {
  const { data, isFetched } = useLeaderboardMetasQuery(
    {
      version,
    },
    // {
    //   enabled: true,
    // },
  );

  const leaderboardMetas = useMemo(() => {
    return LeaderboardMetas.create(data?.leaderboardModels?.edges as LeaderboardEdge[]);
  }, [data]);

  return {
    leaderboardMetas,
    isFetched,
  };
};
