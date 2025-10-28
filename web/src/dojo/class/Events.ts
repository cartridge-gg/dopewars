import { Dopewars_V0_Game as Game } from "@/generated/graphql";
import { action, computed, makeObservable, observable } from "mobx";
import { ConfigStoreClass } from "../stores/config";
import { Entity } from "@dojoengine/torii-client";
import { parseStruct } from "../utils";
import {
  GameCreated,
  GameOver,
  HighVolatility,
  TradeDrug,
  Traveled,
  TravelEncounter,
  TravelEncounterResult,
  UpgradeItem,
} from "@/components/layout/GlobalEvents";
import { num, shortString } from "starknet";
import { DW_NS } from "../constants";

export interface DojoEvent {
  eventName: string;
  event: any;
  idx: number;
}

export class EventClass {
  gameInfos: Game;
  configStore: ConfigStoreClass;

  events: DojoEvent[];

  constructor(configStore: ConfigStoreClass, gameInfos: Game, entities: Entity[]) {
    this.gameInfos = gameInfos;
    this.configStore = configStore;
    this.events = EventClass.parseEntities(entities);

    makeObservable(this, {
      events: observable,
      addEvent: action,
      sortedEvents: computed,
      isGameOver: computed,
      lastEncounter: computed,
      lastEncounterResult: computed,
    });
  }

  public static parseEntities(entities: Entity[]): DojoEvent[] {
    return entities.flatMap((entity) => {
      return EventClass.parseEntity(entity);
    });
  }

  public static parseEntity(entity: Entity): DojoEvent[] {
    const models = entity.models;
    const events = Object.keys(models).map((key, i) => {
      if (key.startsWith(`${DW_NS}-GameCreated`)) {
        return {
          eventName: "GameCreated",
          event: parseStruct(models[key]) as GameCreated,
          idx: i,
        };
      }

      if (key.startsWith(`${DW_NS}-GameOver`)) {
        const event = parseStruct(models[key]) as GameOver;
        event.player_name = shortString.decodeShortString(num.toHexString(BigInt(event.player_name)));
        return {
          eventName: "GameOver",
          event,
          idx: i,
        };
      }

      if (key === `${DW_NS}-Traveled` || key.startsWith(`${DW_NS}-Traveled-`)) {
        const event = parseStruct(models[key]) as Traveled;
        return {
          eventName: "Traveled",
          event,
          idx: key === `${DW_NS}-Traveled` ? 0 : Number(key.replace(`${DW_NS}-Traveled-`, "")),
        };
      }

      if (key === `${DW_NS}-TradeDrug` || key.startsWith(`${DW_NS}-TradeDrug-`)) {
        const event = parseStruct(models[key]) as TradeDrug;
        return {
          eventName: "TradeDrug",
          event,
          idx: key === `${DW_NS}-TradeDrug` ? 0 : Number(key.replace(`${DW_NS}-TradeDrug-`, "")),
        };
      }

      if (key === `${DW_NS}-UpgradeItem` || key.startsWith(`${DW_NS}-UpgradeItem-`)) {
        const event = parseStruct(models[key]) as UpgradeItem;
        return {
          eventName: "UpgradeItem",
          event,
          idx: key === `${DW_NS}-UpgradeItem` ? 0 : Number(key.replace(`${DW_NS}-UpgradeItem-`, "")),
        };
      }

      if (key === `${DW_NS}-TravelEncounter` || key.startsWith(`${DW_NS}-TravelEncounter-`)) {
        const event = parseStruct(models[key]) as TravelEncounter;
        event.encounter = shortString.decodeShortString(num.toHexString(Number(event.encounter)));
        return {
          eventName: "TravelEncounter",
          event,
          idx: key === `${DW_NS}-TravelEncounter` ? 0 : Number(key.replace(`${DW_NS}-TravelEncounter-`, "")),
        };
      }

      if (key === `${DW_NS}-TravelEncounterResult` || key.startsWith(`${DW_NS}-TravelEncounterResult-`)) {
        return {
          eventName: "TravelEncounterResult",
          event: parseStruct(models[key]) as TravelEncounterResult,
          idx:
            key === `${DW_NS}-TravelEncounterResult` ? 0 : Number(key.replace(`${DW_NS}-TravelEncounterResult-`, "")),
        };
      }

      if (key === `${DW_NS}-HighVolatility` || key.startsWith(`${DW_NS}-HighVolatility-`)) {
        return {
          eventName: "HighVolatility",
          event: parseStruct(models[key]) as HighVolatility,
          idx: key === `${DW_NS}-HighVolatility` ? 0 : Number(key.replace(`${DW_NS}-HighVolatility-`, "")),
        };
      }

      return {
        eventName: key,
        event: parseStruct(models[key]),
        idx: i,
      };
    });

    return events || [];
  }

  get isGameOver() {
    return this.events.find((i: DojoEvent) => i?.eventName === "GameOver") !== undefined;
  }

  addEvent(entity: Entity) {
    const event = EventClass.parseEntity(entity);
    if (event.length === 0) return;
    this.events.push(event[0]);
  }

  get sortedEvents() {
    return this.events.slice().sort((a, b) => b.idx - a.idx);
  }

  get lastEncounter() {
    return this.sortedEvents.findLast((i: DojoEvent) => i?.eventName === "TravelEncounter");
  }

  get lastEncounterResult() {
    return this.sortedEvents.findLast((i: DojoEvent) => i?.eventName === "TravelEncounterResult");
  }
}
