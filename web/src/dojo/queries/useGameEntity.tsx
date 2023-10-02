import { Game, useGameEntityQuery } from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { ec, num } from "starknet";
import { REFETCH_INTERVAL } from "../constants";

interface GameEntityData {
  entity: {
    components: Game[];
  };
}

export class GameEntity {
  creator: string;
  isFinished: boolean;
  maxPlayers: number;
  maxTurns: number;
  numPlayers: number;
  startTime: number;

  constructor(game: Game) {
    this.creator = game.creator;
    this.isFinished = game.is_finished;
    this.maxPlayers = game.max_players;
    this.maxTurns = game.max_turns;
    this.numPlayers = game.num_players;
    this.startTime = game.start_time;
  }

  static create(data: GameEntityData): GameEntity | undefined {
    if (!data || !data.entity) return undefined;

    const components = data.entity.components || [];
    const gameComponent = components.find(
      (component) => component.__typename === "Game",
    );

    if (!gameComponent) return undefined;

    return new GameEntity(gameComponent as Game);
  }
}

export interface GameInterface {
  game?: GameEntity;
  isFetched: boolean;
}

export const useGameEntity = ({
  gameId,
}: {
  gameId?: string;
}): GameInterface => {
  const key: string = useMemo(() => {
    return num.toHex(
      ec.starkCurve.poseidonHashMany([num.toBigInt(gameId || "")]),
    );
  }, [gameId]);

  const { data, isFetched } = useGameEntityQuery(
    { id: key },
    {
      enabled: !!gameId,
    },
  );

  const game = useMemo(() => {
    return GameEntity.create(data as GameEntityData);
  }, [data]);

  return {
    game,
    isFetched,
  };
};
