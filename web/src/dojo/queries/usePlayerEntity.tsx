import {
  Player,
  Drug as DrugType,
  usePlayerEntityQuery,
  EntityEdge,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "../constants";
import { PlayerStatus, ItemEnum } from "../types";
import { shortString } from "starknet";

type Drug = {
  id: string;
  quantity: number;
};

type Items = {
  id: ItemEnum;
  level: number;
};

export class PlayerEntity {
  name: string;
  cash: number;
  health: number;
  turnsRemaining: number;
  turnsRemainingOnDeath: number;
  drugCount: number;
  bagLimit: number;
  locationId?: string;
  status: PlayerStatus;
  drugs: Drug[];
  items: Items[];

  constructor(player: Player, drugs: Drug[], items: Item[]) {
    this.name = shortString.decodeShortString(player.name)
    this.cash = Number(player.cash) / SCALING_FACTOR;
    this.health = player.health;
    this.turnsRemaining = player.turns_remaining;
    this.turnsRemainingOnDeath = player.turns_remaining_on_death;
    this.drugCount = player.drug_count;
    this.bagLimit = player.bag_limit;
    this.locationId =
      player.location_id === "Home" ? undefined : player.location_id;
    this.status = player.status;

    this.drugs = drugs;
    this.items = items;
  }

  static create(edges: EntityEdge[]): PlayerEntity | undefined {
    if (!edges || edges.length === 0) return undefined;
    // player model
    const playerModel = edges.find((edge) => {
      return edge.node?.models?.some(
        (model) => model?.__typename === "Player",
      );
    })?.node?.models?.[0] as Player;

    // TODO: create helpers
    // drug entities
    const drugEdges = edges.filter((edge) =>
      edge.node?.models?.find(
        (model) => model?.__typename === "Drug",
      ),
    );

    const drugs: Drug[] = drugEdges.map((edge) => {
      const drugModel = edge.node?.models?.find(
        (model) => model?.__typename === "Drug",
      ) as DrugType;

      return {
        id: drugModel.drug_id,
        quantity: drugModel.quantity,
      };
    });

    // items 
    const itemEdges = edges.filter((edge) =>
      edge.node?.models?.find(
        (model) => model?.__typename === "Item",
      ),
    );

    const items: Item[] = itemEdges.map((edge) => {
      const itemModel = edge.node?.models?.find(
        (model) => model?.__typename === "Item",
      ) as DrugType;

      return {
        id: itemModel.item_id,
        level: itemModel.level,
      };
    });

    if (!playerModel) return undefined;

    return new PlayerEntity(playerModel, drugs, items);
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
