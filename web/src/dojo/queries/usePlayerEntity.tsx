import { Player, Drug as DrugType, usePlayerEntityQuery, EntityEdge, Item as ItemType } from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "../constants";
import { PlayerStatus, ItemEnum, ItemTextEnum } from "../types";
import { shortString } from "starknet";

type Drug = {
  id: string;
  quantity: number;
};

export type ShopItem = {
  id: ItemTextEnum; // ItemEnum as string
  level: number;
  name: string;
  value: number;
};

export class PlayerEntity {
  name: string;
  avatarId: number;
  cash: number;
  health: number;
  turn: number;
  maxTurns: number;
  maxItems: number;
  drugCount: number;
  locationId?: string;
  status: PlayerStatus;
  drugs: Drug[];
  items: ShopItem[];

  attack: number;
  defense: number;
  transport: number;
  speed: number;

  wanted: number;

  constructor(player: Player, drugs: Drug[], items: ShopItem[]) {
    this.name = shortString.decodeShortString(player.name);
    this.avatarId = player.avatar_id;
    this.cash = Number(player.cash) / SCALING_FACTOR;
    this.health = player.health;
    this.turn = player.turn;
    this.maxTurns = player.max_turns;
    this.maxItems = player.max_items;

    this.drugCount = player.drug_count;

    this.locationId = player.location_id === "Home" ? undefined : player.location_id;
    this.nextLocationId = player.next_location_id === "Home" ? undefined : player.next_location_id;
    this.status = player.status;

    this.drugs = drugs;
    this.items = items;

    this.attack = player.attack;
    this.defense = player.defense;
    this.transport = player.transport;
    this.speed = player.speed;

    this.wanted = player.wanted;
  }

  update(player: Player) {
    this.cash = Number(player.cash) / SCALING_FACTOR;
    this.health = player.health;
    this.turn = player.turn;
    this.drugCount = player.drug_count;
    this.locationId = player.location_id === "Home" ? undefined : player.location_id;
    this.status = player.status;
    this.wanted = player.wanted;
    return this;
  }

  updateDrug(newDrug: DrugType) {
    const drug = this.drugs.find((i) => i.id === newDrug.drug_id);
    if (drug) {
      drug.quantity = newDrug.quantity;
    } else {
      this.drugs.push({
        id: newDrug.drug_id,
        quantity: newDrug.quantity,
      });
    }
    return this;
  }

  updateItem(newItem: ItemType) {
    const item = this.items.find((i) => i.id === newItem.item_id);
    if (item) {
      item.level = newItem.level;
      item.value = newItem.value;
    } else {
      this.items.push({
        id: newItem.item_id as ItemTextEnum,
        level: newItem.level,
        name: shortString.decodeShortString(newItem.name),
        value: newItem.value,
      });
    }
    return this;
  }

  getTransport(): number {
    const transportItem = this.items.find((i) => i.id === ItemTextEnum.Transport);
    if (transportItem) {
      return this.transport + transportItem.value;
    }
    return this.transport;
  }

  static create(edges: EntityEdge[]): PlayerEntity | undefined {
    if (!edges || edges.length === 0) return undefined;
    // player model
    const playerModel = edges.find((edge) => {
      return edge.node?.models?.some((model) => model?.__typename === "Player");
    })?.node?.models?.[0] as Player;

    // TODO: create helpers
    // drug entities
    const drugEdges = edges.filter((edge) => edge.node?.models?.find((model) => model?.__typename === "Drug"));

    const drugs: Drug[] = drugEdges.map((edge) => {
      const drugModel = edge.node?.models?.find((model) => model?.__typename === "Drug") as DrugType;

      return {
        id: drugModel.drug_id,
        quantity: drugModel.quantity,
      };
    });

    // items
    const itemEdges = edges.filter((edge) => edge.node?.models?.find((model) => model?.__typename === "Item"));

    const items: ShopItem[] = itemEdges.map((edge) => {
      const itemModel = edge.node?.models?.find((model) => model?.__typename === "Item") as Item;

      return {
        id: itemModel.item_id as ItemTextEnum,
        level: itemModel.level,
        name: shortString.decodeShortString(itemModel.name),
        value: itemModel.value,
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

export const usePlayerEntity = ({ gameId, address }: { gameId?: string; address?: string }): PlayerInterface => {
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
