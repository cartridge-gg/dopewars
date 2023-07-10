import { Game, useGameEntityQuery } from "@/generated/graphql";
import { useEffect, useState } from "react";
import { ec, num } from "starknet";
import { REFETCH_INTERVAL } from "..";

interface GameEntityData {
  entity: {
    components: Game[];
  };
}

export class GameEntity {
  creator: string;
  gameId: number;
  isFinished: boolean;
  maxPlayers: number;
  maxTurns: number;
  numPlayers: number;
  startTime: number;

  constructor(game: Game) {
    this.creator = game.creator;
    this.gameId = game.game_id;
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
  const [game, setGame] = useState<GameEntity>();
  const [key, setKey] = useState<string>("");

  const { data, isFetched } = useGameEntityQuery(
    { id: key },
    {
      enabled: !!gameId,
    },
  );

  useEffect(() => {
    if (gameId) {
      const key_ = ec.starkCurve.poseidonHashMany([num.toBigInt(gameId)]);
      setKey(num.toHex(key_));
    }
  }, [gameId]);

  useEffect(() => {
    const game_ = GameEntity.create(data as GameEntityData);
    if (game_) setGame(game_);
  }, [data]);

  return {
    game,
    isFetched,
  };
};
