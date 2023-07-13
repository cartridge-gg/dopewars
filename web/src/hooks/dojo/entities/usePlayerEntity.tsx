import {
  Player,
  Location,
  Drug as DrugType,
  Name,
  usePlayerEntityQuery,
} from "@/generated/graphql";
import { useCallback, useEffect, useState } from "react";
import { shortString } from "starknet";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "..";

interface PlayerEntityData {
  entities: [
    {
      components: (Player | Location | DrugType | Name)[];
    },
  ];
}

type Drug = {
  name: string;
  quantity: number;
};

export class PlayerEntity {
  cash: number;
  health: number;
  turnsRemaining: number;
  location_name: string;
  drugs: Drug[];

  constructor(player: Player, location: Location, drugs: Drug[]) {
    this.cash = Number(player.cash) / SCALING_FACTOR;
    this.health = player.health;
    this.turnsRemaining = player.turns_remaining;
    this.location_name = shortString.decodeShortString(location.name);
    this.drugs = drugs;
  }

  static create(data: PlayerEntityData): PlayerEntity | undefined {
    if (!data || !data.entities) return undefined;

    // player related entities
    const playerEntities = data.entities.find((entity) =>
      entity.components.find((component) => component.__typename === "Player"),
    );
    const playerComponent = playerEntities?.components.find(
      (component) => component.__typename === "Player",
    ) as Player;
    const locationComponent = playerEntities?.components.find(
      (component) => component.__typename === "Location",
    ) as Location;

    // drug entities
    const drugEntities = data.entities.filter((entity) =>
      entity.components.find((component) => component.__typename === "Drug"),
    );

    const drugs: Drug[] = drugEntities.map((entity) => {
      const drugComponent = entity.components.find(
        (component) => component.__typename === "Drug",
      ) as DrugType;

      const nameComponent = entity.components.find(
        (component) => component.__typename === "Name",
      ) as Name;

      return {
        name: shortString.decodeShortString(nameComponent.short_string),
        quantity: drugComponent.quantity,
      };
    });

    if (!playerEntities) return undefined;

    return new PlayerEntity(playerComponent, locationComponent, drugs);
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

  // TODO: remove leading zeros in address, maybe implemented in torii
  const { data, isFetched, refetch } = usePlayerEntityQuery(
    { gameId: gameId || "", playerId: address || "" },
    {
      enabled: !!gameId && !!address,
      refetchInterval: REFETCH_INTERVAL, // TODO: long polling,
    },
  );
  useEffect(() => {
    const player_ = PlayerEntity.create(data as PlayerEntityData);
    if (player_) setPlayer(player_);
  }, [data]);

  return {
    player,
    isFetched,
  };
};
