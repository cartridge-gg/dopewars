import { World__EventEdge, useGameOverEventsQuery } from "@/generated/graphql";
import { useEffect, useMemo } from "react";
import { GameOverData, parseEvent } from "../events";
import { WorldEvents } from "../generated/contractEvents";
import { useDojoContext } from "./useDojoContext";

export type LeaderboardEntriesResult = ReturnType<typeof useLeaderboardEntries>;

export const useLeaderboardEntries = (version: number) => {
  const {
    chains: {
      selectedChain
    },
  } = useDojoContext();

  const {  data, isFetching, isRefetching, isError, refetch  } = useGameOverEventsQuery({
    gameOverSelector: WorldEvents.GameOver,
    // @ts-ignore
    version: `0x${version.toString(16)}`,
  });

  useEffect(() => {
    refetch();
  }, [selectedChain.toriiUrl]);

  const leaderboardEntries = useMemo(() => {
    if (isError || isFetching || isRefetching || !data) return [];

    const edges = (data.events?.edges || []) as World__EventEdge[];
    const nodes = edges.map((i: World__EventEdge) => i.node as World__Event);
    const parsed = nodes.map((i: World__EventEdge) => {
      return parseEvent(i) as GameOverData;
    });
    const sorted = parsed.sort((a, b) => b.cash - a.cash);
    return sorted;
  }, [data, isFetching,isRefetching, isError]);

  return {
    leaderboardEntries,
    isFetchingLeaderboardEntries: isFetching || isRefetching,
    refetchLeaderboardEntries: refetch,
  };
};
