import { Dopewars_Game as Game } from "@/generated/graphql";
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

export interface DojoEvent {
  eventName: string;
  event: any;
  idx: number;
}

export class EventClass {
  gameInfos: Game;
  configStore: ConfigStoreClass;

  events: DojoEvent[];

  constructor(configStore: ConfigStoreClass, gameInfos: Game, entity: Entity) {
    this.gameInfos = gameInfos;
    this.configStore = configStore;
    this.events = EventClass.parseEntity(entity);

    makeObservable(this, {
      events: observable,
      addEvent: action,
      sortedEvents: computed,
      isGameOver: computed,
      lastEncounter: computed,
      lastEncounterResult: computed,
    });
  }

  public static parseEntity(entity: Entity): DojoEvent[] {
    const events = Object.keys(entity).map((key, i) => {
      if (key.startsWith("dopewars-GameCreated")) {
        return {
          eventName: "GameCreated",
          event: parseStruct(entity[key]) as GameCreated,
          idx: i,
        };
      }

      if (key.startsWith("dopewars-GameOver")) {
        const event = parseStruct(entity[key]) as GameOver;
        event.player_name = shortString.decodeShortString(num.toHexString(BigInt(event.player_name)));
        return {
          eventName: "GameOver",
          event,
          idx: i,
        };
      }

      if (key === "dopewars-Traveled" || key.startsWith("dopewars-Traveled-")) {
        const event = parseStruct(entity[key]) as Traveled;
        return {
          eventName: "Traveled",
          event,
          idx: key === "dopewars-Traveled" ? 0 : Number(key.replace("dopewars-Traveled-", "")),
        };
      }

      if (key === "dopewars-TradeDrug" || key.startsWith("dopewars-TradeDrug-")) {
        const event = parseStruct(entity[key]) as TradeDrug;
        return {
          eventName: "TradeDrug",
          event,
          idx: key === "dopewars-TradeDrug" ? 0 : Number(key.replace("dopewars-TradeDrug-", "")),
        };
      }

      if (key === "dopewars-UpgradeItem" || key.startsWith("dopewars-UpgradeItem-")) {
        const event = parseStruct(entity[key]) as UpgradeItem;
        return {
          eventName: "UpgradeItem",
          event,
          idx: key === "dopewars-UpgradeItem" ? 0 : Number(key.replace("dopewars-UpgradeItem-", "")),
        };
      }

      if (key === "dopewars-TravelEncounter" || key.startsWith("dopewars-TravelEncounter-")) {
        const event = parseStruct(entity[key]) as TravelEncounter;
        event.encounter = shortString.decodeShortString(num.toHexString(Number(event.encounter)));
        return {
          eventName: "TravelEncounter",
          event,
          idx: key === "dopewars-TravelEncounter" ? 0 : Number(key.replace("dopewars-TravelEncounter-", "")),
        };
      }

      if (key === "dopewars-TravelEncounterResult" || key.startsWith("dopewars-TravelEncounterResult-")) {
        return {
          eventName: "TravelEncounterResult",
          event: parseStruct(entity[key]) as TravelEncounterResult,
          idx:
            key === "dopewars-TravelEncounterResult" ? 0 : Number(key.replace("dopewars-TravelEncounterResult-", "")),
        };
      }

      if (key === "dopewars-HighVolatility" || key.startsWith("dopewars-HighVolatility-")) {
        return {
          eventName: "HighVolatility",
          event: parseStruct(entity[key]) as HighVolatility,
          idx: key === "dopewars-HighVolatility" ? 0 : Number(key.replace("dopewars-HighVolatility-", "")),
        };
      }

      return {
        eventName: key,
        event: parseStruct(entity[key]),
        idx: i,
      };
    });

    return events || [];
  }

  get isGameOver() {
    return this.events.find((i: DojoEvent) => i?.eventName === "GameOver") !== undefined;
  }

  addEvent(entity: any) {
    // console.log("addEvent", entity);
    const event = EventClass.parseEntity(entity)[0];
    if (!event) return;
    this.events.push(event);

    // console.log(this.sortedEvents)
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
