import {
  Player,
  Drug as DrugType,
  usePlayerEntityQuery,
  EntityEdge,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "../constants";
import { PlayerStatus } from "../types";

type Drug = {
  id: string;
  quantity: number;
};

export class PlayerEntity {
  cash: number;
  health: number;
  turnsRemaining: number;
  turnsRemainingOnDeath: number;
  drugCount: number;
  bagLimit: number;
  locationId?: string;
  status: PlayerStatus;
  drugs: Drug[];

  constructor(player: Player, drugs: Drug[]) {
    this.cash = Number(player.cash) / SCALING_FACTOR;
    this.health = player.health;
    this.turnsRemaining = player.turns_remaining;
    this.turnsRemainingOnDeath = player.turns_remaining_on_death;
    this.drugCount = player.drug_count;
    this.bagLimit = player.bag_limit;
    this.locationId =
      player.location_id === "0x0" ? undefined : player.location_id;
    this.status = player.status;
    this.drugs = drugs;
  }

  static create(edges: EntityEdge[]): PlayerEntity | undefined {
    if (!edges || edges.length === 0) return undefined;

    // player component
    const playerComponent = edges.find((edge) => {
      return edge.node?.components?.some(
        (component) => component?.__typename === "Player",
      );
    })?.node?.components?.[0] as Player;

    // drug entities
    const drugEdges = edges.filter((edge) =>
      edge.node?.components?.find(
        (component) => component?.__typename === "Drug",
      ),
    );

    const drugs: Drug[] = drugEdges.map((edge) => {
      const drugComponent = edge.node?.components?.find(
        (component) => component?.__typename === "Drug",
      ) as DrugType;

      return {
        id: drugComponent.drug_id,
        quantity: drugComponent.quantity,
      };
    });

    if (!playerComponent) return undefined;

    return new PlayerEntity(playerComponent, drugs);
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
  // TODO: remove leading zeros in address, maybe implemented in torii
  const { data, isFetched } = usePlayerEntityQuery(
    { gameId: gameId || "", playerId: address || "" },
    {
      enabled: !!gameId && !!address,
      refetchInterval: REFETCH_INTERVAL, // TODO: long polling,
    },
  );

  const player = useMemo(() => {
    return PlayerEntity.create(data?.entities?.edges as EntityEdge[]);
  }, [data]);

  return {
    player,
    isFetched,
  };
};
