import {
  PlayerEdge,
  useGlobalScoresQuery,
  useInfiniteGlobalScoresQuery,
} from "@/generated/graphql";
import { useCallback, useEffect, useState, useMemo } from "react";

import { shortString } from "starknet";
import { SCALING_FACTOR } from "../constants";

export type Score = {
  address: string;
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
        gameId: playerModel?.game_id,
        address: playerModel?.player_id,
        name: shortString.decodeShortString(playerModel?.name),
        avatarId: playerModel?.avatar_id,
        cash: Math.floor(
          Number(BigInt(edge.node?.cash) / BigInt(SCALING_FACTOR)),
        ),
        dead: Number(edge.node?.health) === 0,
        health: Number(edge.node?.health),
      };
    });
  }
}


export const useGlobalScoresIninite = (offset?: number, limit?: number) => {
  const [scores, setScores] = useState<Score[]>([]);
  // Gets top 10
  const { data, isFetched, refetch, hasNextPage, fetchNextPage, ...props } =
    useInfiniteGlobalScoresQuery(
      {
        limit: limit || 10,
      },
      {
        getNextPageParam: (lastPage) => {
          const edgesCount = lastPage.playerModels?.edges?.length || 0;
          if (edgesCount === 0) return undefined;
          const lastItem = lastPage.playerModels?.edges![edgesCount - 1];
          return {
            limit: 10,
            cursor: lastItem && lastItem.cursor,
          };
        },
      },
    );

  useEffect(() => {
    if (data?.pages.length == 0) return;
    const pageCount = data?.pages.length || 0;
    const new_scores = GlobalScores.create(
      data?.pages[pageCount - 1].playerModels?.edges as PlayerEdge[],
    );

    if (new_scores) {
      setScores(scores.concat(new_scores));
    }
  }, [data?.pages]);

  return {
    scores,
    isFetched,
    refetch,
    hasNextPage,
    fetchNextPage,
  };
};
