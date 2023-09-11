import { PlayerEdge, Name, useGlobalScoresQuery } from "@/generated/graphql";
import { useEffect, useState } from "react";
import { shortString } from "starknet";
import { SCALING_FACTOR } from "..";

export type Score = {
  gameId: string;
  address: string;
  name?: string;
  cash: number;
};

export class GlobalScores {
  scores: Score[];
  constructor(scores: Score[]) {
    this.scores = scores;
  }

  static create(edges: PlayerEdge[]): Score[] | undefined {
    if (!edges || edges.length === 0) return undefined;

    return edges.map((edge) => {
      const keys = edge.node?.entity?.keys || [];
      const gameId = keys[0]!;
      const address = keys[1]!;

      const components = edge.node?.entity?.components || [];
      const nameComponent = components.find(
        (component) => component?.__typename === "Name",
      ) as Name;

      return {
        gameId,
        address,
        name:
          nameComponent &&
          shortString.decodeShortString(nameComponent?.short_string),
        cash: Math.floor(Number(edge.node?.cash) / SCALING_FACTOR),
      };
    });
  }
}

export const useGlobalScores = (offset?: number, limit?: number) => {
  const [scores, setScores] = useState<Score[]>([]);
  // Gets top 100
  // TODO: paginate with cursor for more scores
  const { data, isFetched, refetch } = useGlobalScoresQuery({
    limit: limit || 100,
  });

  useEffect(() => {
    const scores = GlobalScores.create(
      data?.playerComponents?.edges as PlayerEdge[],
    );
    if (scores) {
      setScores(scores);
    }
  }, [data]);

  return {
    scores,
    isFetched,
    refetch,
  };
};
