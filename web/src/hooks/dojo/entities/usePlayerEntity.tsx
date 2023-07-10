import { Player, Location, usePlayerEntityQuery } from "@/generated/graphql";
import { useEffect, useState } from "react";
import { ec, num, shortString } from "starknet";
import { SCALING_FACTOR } from "..";

interface PlayerEntityData {
  entity: {
    components: (Player | Location)[];
  };
}

export class PlayerEntity {
  cash: number;
  health: number;
  arrested: boolean;
  turnsRemaining: number;
  location_name: string;

  constructor(player: Player, location: Location) {
    this.cash = parseInt(player.cash, 16) / SCALING_FACTOR;
    this.health = player.health;
    this.arrested = player.arrested;
    this.turnsRemaining = player.turns_remaining;
    this.location_name = shortString.decodeShortString(location.name);
  }

  static create(data: PlayerEntityData): PlayerEntity | undefined {
    if (!data || !data.entity) return undefined;

    const components = data.entity.components || [];
    const playerComponent = components.find(
      (component) => component.__typename === "Player",
    );
    const locationComponent = components.find(
      (component) => component.__typename === "Location",
    );

    if (!playerComponent || !locationComponent) return undefined;

    return new PlayerEntity(
      playerComponent as Player,
      locationComponent as Location,
    );
  }
}

export interface PlayerInterface {
  player?: PlayerEntity;
  isFetched: boolean;
}

export const usePlayerEntity = ({
  gameId,
  address,
}: {
  gameId?: string;
  address?: string;
}): PlayerInterface => {
  const [player, setPlayer] = useState<PlayerEntity>();
  const [key, setKey] = useState<string>("");

  const { data, isFetched } = usePlayerEntityQuery(
    { id: key },
    {
      enabled: !!gameId && !!address,
      refetchInterval: 1000, // TODO: long polling
    },
  );

  useEffect(() => {
    if (gameId && address) {
      const key_ = ec.starkCurve.poseidonHashMany([
        num.toBigInt(gameId),
        num.toBigInt(address),
      ]);
      setKey(num.toHex(key_));
    }
  }, [gameId, address]);

  useEffect(() => {
    const player_ = PlayerEntity.create(data as PlayerEntityData);
    if (player_) setPlayer(player_);
  }, [data]);

  return {
    player,
    isFetched,
  };
};
