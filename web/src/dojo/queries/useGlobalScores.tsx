import { PlayerEdge, World__EventEdge, useInfiniteGameOverEventsQuery } from "@/generated/graphql";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import { shortString } from "starknet";
import { GameOverData, parseEvent } from "../events";
import { WorldEvents } from "../generated/contractEvents";

export type Score = {
  gameId: string;
  playerId: string;
  name?: string;
  avatarId: number;
  cash: number;
  dead: boolean;
  health: number;
};

export class GlobalScores {
  scores: Score[];
  constructor(scores: Score[]) {
    this.scores = scores;
  }

  static create(edges: PlayerEdge[]): Score[] | undefined {
    if (!edges || edges.length === 0) return undefined;

    return edges.map((edge) => {
      const playerModel = edge.node;

      return {
        gameId: `0x${playerModel?.game_id.toString(16)}`,
        playerId: playerModel?.player_id,
        name: shortString.decodeShortString(playerModel?.name),
        avatarId: playerModel?.avatar_id,
        cash: Number(edge.node?.cash),
        dead: Number(edge.node?.health) === 0,
        health: Number(edge.node?.health),
      };
    });
  }
}

export const useGlobalScoresIninite = (version?: number) => {
  const [scores, setScores] = useState<GameOverData[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);

  const queryClient = useQueryClient();

  // Gets top 10
  const { data, isFetched, refetch, /* hasNextPage,*/ fetchNextPage, ...props } = useInfiniteGameOverEventsQuery(
    {
      // limit: limit || 10,
      gameOverSelector: WorldEvents.GameOver,
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage) return {};

        const edgesCount = lastPage.events?.edges?.length || 0;
        if (edgesCount === 0) return undefined;
        const lastItem = lastPage.events?.edges![edgesCount - 1];
        return {
          limit: 10,
          cursor: lastItem && lastItem.cursor,
        };
      },
    },
  );

  const resetQuery = async () => {
    setHasNextPage(false);
    setScores([]);
    queryClient.invalidateQueries({ queryKey: ["GameOverEvents.infinite"] });
    queryClient.resetQueries({ queryKey: ["GameOverEvents.infinite"] });
    queryClient.removeQueries({ queryKey: ["GameOverEvents.infinite"] });
  };

  useEffect(() => {
    if (!data || data?.pages.length == 0) return;
    const pageCount = data?.pages.length || 0;
    const new_scores = data.pages[pageCount - 1].events?.edges.map((i: World__EventEdge) => {
      const parsed = parseEvent(i.node) as GameOverData;
      return parsed;
    });

    if (new_scores) {
      setScores(scores.concat(new_scores));
    }
  }, [data?.pages, version /*, scores*/]);

  useEffect(() => {
    if (data?.pages.length == 0) return;
    const pageCount = data?.pages.length || 0;
    const hasNext = scores.length < (data?.pages[pageCount - 1].events?.totalCount || 0);
    setHasNextPage(hasNext);
  }, [scores]);

  return {
    scores,
    resetQuery,
    isFetched,
    refetch,
    hasNextPage,
    fetchNextPage,
  };
};
