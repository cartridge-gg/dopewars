import { PlayerEdge } from "@/generated/graphql";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import { shortString } from "starknet";

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

export const useGlobalScoresIninite = (version?: number, limit?: number) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);

  const queryClient = useQueryClient();
  
  const data = undefined
  const isFetched = false
  const refetch = () => {}
  const fetchNextPage = () => {}


  // // Gets top 10
  // const { data, isFetched, refetch,/* hasNextPage,*/ fetchNextPage, ...props } = useInfiniteGlobalScoresQuery(
  //   {
  //     limit: limit || 10,
  //     version: version || 1,
  //   },
  //   {
      
  //     getNextPageParam: (lastPage) => {
  //       if(!lastPage) return {}
  //       const edgesCount = lastPage.playerModels?.edges?.length || 0;
  //       if (edgesCount === 0) return undefined;
  //       const lastItem = lastPage.playerModels?.edges![edgesCount - 1];
  //       return {
  //         limit: 10,
  //         cursor: lastItem && lastItem.cursor,
  //       };
  //     },
  //   },
  // );

  const resetQuery = async () => {
    setHasNextPage(false)
    setScores([]);
    queryClient.invalidateQueries({ queryKey: ["GlobalScores.infinite"] })
    queryClient.resetQueries({ queryKey: ["GlobalScores.infinite"] })
    queryClient.removeQueries({ queryKey: ["GlobalScores.infinite"] })
  };

  useEffect(() => {
    if (data?.pages.length == 0) return;
    const pageCount = data?.pages.length || 0;
    const new_scores = GlobalScores.create(data?.pages[pageCount - 1].playerModels?.edges as PlayerEdge[]);

    if (new_scores) {
      setScores(scores.concat(new_scores));
    }
   
  }, [data?.pages, version /*, scores*/]);

  useEffect(() => {
    if (data?.pages.length == 0) return;
    const pageCount = data?.pages.length || 0;
    const hasNext = scores.length < (data?.pages[pageCount-1].playerModels?.totalCount || 0)
    setHasNextPage(hasNext)
  }, [ scores]);

  return {
    scores,
    resetQuery,
    isFetched,
    refetch,
    hasNextPage,
    fetchNextPage,
  };
};
