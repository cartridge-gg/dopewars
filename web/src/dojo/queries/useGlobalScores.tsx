import {
  PlayerEdge,
  Name,
  useGlobalScoresQuery,
  useInfiniteGlobalScoresQuery,
} from "@/generated/graphql";
import { useCallback, useEffect, useState, useMemo } from "react";

import { shortString } from "starknet";
import { SCALING_FACTOR } from "../constants";

export type Score = {
 // gameId: string;
  address: string;
  name?: string;
  cash: number;
  dead: boolean;
};

export class GlobalScores {
  scores: Score[];
  constructor(scores: Score[]) {
    this.scores = scores;
  }

  static create(edges: PlayerEdge[]): Score[] | undefined {
    if (!edges || edges.length === 0) return undefined;

    return edges.map((edge) => {
      // const keys = edge.node?.entity?.keys || [];
      // const gameId = keys[0]!;
      // const address = keys[1]!;

      const models = edge.node?.entity?.models || [];
      const playerModel = models.find(
        (model) => model?.__typename === "Player",
      );

      return {
        gameId: playerModel?.game_id,
        address: playerModel?.player_id,
        name: shortString.decodeShortString(playerModel?.name),
        cash: Math.floor(
          Number(BigInt(edge.node?.cash) / BigInt(SCALING_FACTOR))
        ),
        dead: Number(edge.node?.health) === 0,
      };
    });
  }
}

export const useGlobalScores = (offset?: number, limit?: number) => {
  // Gets top 1000
  // TODO: paginate with cursor for more scores
  const { data, isFetched, refetch } = useGlobalScoresQuery({
    limit: limit || 1000,
  });

  const scores: Score[] = useMemo(() => {
    const scores =
      GlobalScores.create(data?.playerModels?.edges as PlayerEdge[]) || [];
    return scores.sort((a, b) => b.cash - a.cash);
  }, [data]);

  return {
    scores,
    isFetched,
    refetch,
  };
};

// // TODO : use when supported on torii
// export const useGlobalScoresIninite = (offset?: number, limit?: number) => {
//   const [scores, setScores] = useState<Score[]>([]);
//   // Gets top 10
//   // TODO: paginate with cursor for more scores
//   const { data, isFetched, refetch, hasNextPage, fetchNextPage, ...props } =
//     useInfiniteGlobalScoresQuery(
//       {
//         limit: limit || 10,
//       },
//       {
//         getNextPageParam: (lastPage) => {
//           const edgesCount = lastPage.playerComponents?.edges?.length || 0;
//           if ( edgesCount === 0) return undefined
//           const lastItem = lastPage.playerComponents?.edges[edgesCount - 1]
//             return {
//               limit: 10,
//               cursor: lastItem.cursor,
//             };
//           }
//         },
//     );

//   useEffect(() => {
//     if (data?.pages.length == 0) return;
//     const pageCount = data?.pages.length || 0;
//     // debugger
//     const new_scores = GlobalScores.create(
//       data?.pages[pageCount - 1].playerComponents?.edges as PlayerEdge[],
//     );

//     if (new_scores) {
//       setScores(scores.concat(new_scores));
//     }
//   }, [data?.pages]);

//   return {
//     scores,
//     isFetched,
//     refetch,
//     hasNextPage,
//     fetchNextPage,
//   };
// };
