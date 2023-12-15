import { Player, Drug as DrugType, usePlayerEntityQuery, World__EntityEdge, Item as ItemType, Encounter } from "@/generated/graphql";
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
  hoodId: string;
  locationId: string;
  nextLocationId?: string;
  status: PlayerStatus;

  drugs: Drug[];
  items: ShopItem[];
  encounters: Encounter[];

  attack: number;
  defense: number;
  transport: number;
  speed: number;

  wanted: number;
  gameOver: boolean;

  constructor(player: Player, drugs: Drug[], items: ShopItem[], encounters: Encounter[]) {
    this.name = shortString.decodeShortString(player.name);
    this.avatarId = player.avatar_id;
    this.cash = Number(player.cash) / SCALING_FACTOR;
    this.health = player.health;
    this.turn = player.turn;
    this.maxTurns = player.max_turns;
    this.maxItems = player.max_items;

    this.drugCount = player.drug_count;

    this.hoodId = player.hood_id === "Home" ? undefined : player.hood_id;
    this.locationId = player.location_id === "Home" ? undefined : player.location_id;
    this.nextLocationId = player.next_location_id === "Home" ? undefined : player.next_location_id;
    this.status = player.status;

    this.attack = player.attack;
    this.defense = player.defense;
    this.transport = player.transport;
    this.speed = player.speed;

    this.wanted = player.wanted;
    this.gameOver = player.game_over;

    this.drugs = drugs;
    this.items = items;
    this.encounters = encounters;

  }

  update(player: Player) {
    this.cash = Number(player.cash) / SCALING_FACTOR;
    this.health = player.health;
    this.turn = player.turn;
    this.drugCount = player.drug_count;
   
    this.hoodId = player.hood_id;
    this.locationId = player.location_id === "Home" ? undefined : player.location_id;
    this.status = player.status;
    this.wanted = player.wanted;
    this.gameOver = player.game_over;
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
      item.name = shortString.decodeShortString(newItem.name);
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

  updateEncounter(newEncounter: Encounter) {
    const encounter = this.encounters.find((i) => i.encounter_id === newEncounter.encounter_id);
    if (encounter) {
      encounter.level = newEncounter.level;
      encounter.health = newEncounter.health;
      encounter.payout = Number(newEncounter.payout) / SCALING_FACTOR;
    } else {
      this.encounters.push({
        ...newEncounter,
        payout:Number(newEncounter.payout) / SCALING_FACTOR,
      });
    }
    return this;
  }

  getAttack(): number {
    const item = this.items.find((i) => i.id === ItemTextEnum.Attack);
    if (item) {
      return this.attack + item.value;
    }
    return this.attack;
  }

  getDefense(): number {
    const item = this.items.find((i) => i.id === ItemTextEnum.Defense);
    if (item) {
      return this.defense + item.value;
    }
    return this.defense;
  }

  getTransport(): number {
    const item = this.items.find((i) => i.id === ItemTextEnum.Transport);
    if (item) {
      return this.transport + item.value;
    }
    return this.transport;
  }

  getSpeed(): number {
    const item = this.items.find((i) => i.id === ItemTextEnum.Speed);
    if (item) {
      return this.speed + item.value;
    }
    return this.speed;
  }



  static create(edges: World__EntityEdge[]): PlayerEntity | undefined {
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
      const itemModel = edge.node?.models?.find((model) => model?.__typename === "Item") as ItemType;

      return {
        id: itemModel.item_id as ItemTextEnum,
        level: itemModel.level,
        name: shortString.decodeShortString(itemModel.name),
        value: itemModel.value,
      };
    });

    // encounters
    const encounterEdges = edges.filter((edge) => edge.node?.models?.find((model) => model?.__typename === "Encounter"));

    const encounters: Encounter[] = encounterEdges.map((edge) => {
      const encounterModel = edge.node?.models?.find((model) => model?.__typename === "Encounter") as Encounter;
      return {
        ...encounterModel,
        payout:Number(encounterModel.payout) / SCALING_FACTOR,
      }
    });

    if (!playerModel) return undefined;

    return new PlayerEntity(playerModel, drugs, items, encounters);
  }
}

