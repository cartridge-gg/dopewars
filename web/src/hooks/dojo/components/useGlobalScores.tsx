import { Player, useGlobalScoresQuery } from "@/generated/graphql";
import { useEffect, useState } from "react";
import { SCALING_FACTOR } from "..";

interface PlayerComponentData {
  playerComponents: Player[];
}

export type Score = {
  address: string;
  name: string;
  cash: number;
};

export class GlobalScores {
  scores: Score[];
  constructor(scores: Score[]) {
    this.scores = scores;
  }

  static create(data: PlayerComponentData): Score[] | undefined {
    if (!data || !data.playerComponents) return undefined;

    // TODO: torii to support relationshipto retrieve player
    // address and nameddress
    // and name could be retrieved
    const scores = data.playerComponents.map((player) => {
      return {
        address: "",
        name: "",
        cash: Math.floor(Number(player.cash) / SCALING_FACTOR),
      };
    });

    return scores;
  }
}

export const useGlobalScores = (offset?: number, limit?: number) => {
  const [scores, setScores] = useState<Score[]>([]);
  const { data, isFetched } = useGlobalScoresQuery({
    limit: limit || 100,
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
  };
};
