import { Player, Name, useGlobalScoresQuery } from "@/generated/graphql";
import { useEffect, useState } from "react";
import { shortString } from "starknet";
import { SCALING_FACTOR } from "..";

interface PlayerComponentData {
  playerComponents: Player[];
}

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

  static create(data: PlayerComponentData): Score[] | undefined {
    if (!data || !data.playerComponents) return undefined;

    const scores = data.playerComponents.map((player) => {
      const keys = player.entity?.keys.split(",") || [];
      const gameId = keys[0];
      const address = keys[1];

      const components = player.entity?.components || [];
      const nameComponent = components.find(
        (component) => component?.__typename === "Name",
      ) as Name;

      return {
        gameId,
        address,
        name:
          nameComponent &&
          shortString.decodeShortString(nameComponent?.short_string),
        cash: Math.floor(Number(player.cash) / SCALING_FACTOR),
      };
    });

    return scores;
  }
}

export const useGlobalScores = (offset?: number, limit?: number) => {
  const [scores, setScores] = useState<Score[]>([]);
  const { data, isFetched, refetch } = useGlobalScoresQuery({
    limit: limit || 500,
  });

  useEffect(() => {
    const scores_ = GlobalScores.create(data as PlayerComponentData);
    if (scores_) {
      // TODO: torii does not yet support orderby, so retrieve
      // all and sort/filter here for now
      scores_.sort((a, b) => b.cash - a.cash);
      setScores(scores_);
    }
  }, [data]);

  return {
    scores,
    isFetched,
    refetch,
  };
};
