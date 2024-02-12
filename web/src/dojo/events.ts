import { EncountersAction, Outcome } from "@/dojo/types";
import {
  GetTransactionReceiptResponse,
  InvokeTransactionReceiptResponse,
  num,
  shortString
} from "starknet";

import { Siren, Truck } from "@/components/icons";
import { ToastType } from "@/hooks/toast";
import { WorldEvents } from "./generated/contractEvents";
import { getDrugByType, getLocationByType } from "./helpers";

export interface BaseEventData {
  gameId: string;
  eventType: WorldEvents;
  eventName: string;
}


export interface GameCreatedEventData extends BaseEventData {
  playerId: string;
  gameMode: number;
  playerName: string;
}

export interface TraveledEventData extends BaseEventData {
  playerId: string;
  turn: number;
  fromLocationId: number;
  toLocationId: number;
}

export interface TradeDrugData extends BaseEventData {
  drugDd: number;
  quantity: number;
  price: number;
  isBuy: boolean;
}

export interface HighVolatilityData extends BaseEventData {
  locationId: string;
  drugId: string;
  increase: boolean;
}

export interface UpgradeItemData extends BaseEventData {
  itemSlot: number;
  itemLevel: number;
}

export interface TravelEncounterData extends BaseEventData {
  playerId: string;
  attack: number;
  health: number;
  level: number;
  encounterId: number;
  healthLoss: number;
  demandPct: number;
  payout: number;
}


//
//
//


export interface DecisionEventData extends BaseEventData {
  playerId: string;
  action: EncountersAction;
}

export interface ConsequenceEventData extends BaseEventData {
  playerId: string;
  outcome: Outcome;
  healthLoss: number;
  drugLoss: number;
  cashLoss: number;
  dmgDealt: number;
  cashEarnt: number;
}


export interface GameOverEventData extends BaseEventData {
  playerId: string;
  playerName: string;
  turn: number;
  cash: number;
}


export const parseAllEvents = (receipt: GetTransactionReceiptResponse) => {
  // if (receipt.status === "REJECTED") {
  //   throw new Error(`transaction REJECTED`);
  // }
  if (receipt.execution_status === "REVERTED") {
    throw new Error(`transaction REVERTED`);
  }

  const flatEvents = parseEvents(receipt as InvokeTransactionReceiptResponse)
  return flatEvents
}

export const parseEvents = (receipt: InvokeTransactionReceiptResponse) => {
  const parsed = receipt.events.map(e => parseEvent(e))
  return parsed
}

export const parseEventsByEventType = (receipt: InvokeTransactionReceiptResponse, eventType: WorldEvents) => {
  const events = receipt.events.filter(e => e.keys[0] === eventType)
  const parsed = events.map(e => parseEvent(e))
  return parsed
}

export type ParseEventResult = ReturnType<typeof parseEvent>;

export const parseEvent = (raw: any) => {

  switch (raw.keys[0]) {
    case WorldEvents.GameCreated:
      return {
        eventType: WorldEvents.GameCreated,
        eventName: "GameCreated",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        gameMode: Number(raw.data[0]),
        playerName: shortString.decodeShortString(raw.data[1]),
      } as GameCreatedEventData;

    case WorldEvents.Traveled:
      return {
        eventType: WorldEvents.Traveled,
        eventName: "Traveled",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        turn: Number(raw.data[0]),
        fromLocationId: Number(raw.data[1]),
        toLocationId: Number(raw.data[2]),
      } as TraveledEventData;


    case WorldEvents.TradeDrug:
      return {
        eventType: WorldEvents.Traveled,
        eventName: "Traveled",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        drugId: Number(raw.data[0]),
        quantity: Number(raw.data[1]),
        price: Number(raw.data[2]),
        isBuy: raw.data[3] === "0x0" ? false : true,
      } as TradeDrugData;


    case WorldEvents.HighVolatility:
      return {
        eventType: WorldEvents.HighVolatility,
        eventName: "HighVolatility",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        locationId: num.toHexString(raw.data[0]),
        drugId: num.toHexString(raw.data[1]),
        increase: raw.data[2] === "0x0" ? false : true,
      } as HighVolatilityData;


    case WorldEvents.UpgradeItem:
      return {
        eventType: WorldEvents.UpgradeItem,
        eventName: "UpgradeItem",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        itemSlot: num.toHexString(raw.data[0]),
        itemLevel: num.toHexString(raw.data[1]),
      } as UpgradeItemData;


    case WorldEvents.TravelEncounter:
      return {
        eventType: WorldEvents.TravelEncounter,
        eventName: "TravelEncounter",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        encounterId: Number(raw.data[0]),
        attack: Number(raw.data[1]),
        health: Number(raw.data[2]),
        level: Number(raw.data[3]),
        healthLoss: Number(raw.data[4]),
        demandPct: Number(raw.data[5]),
        payout: Number(raw.data[6]),
      } as TravelEncounterData;






    // case WorldEvents.Decision:
    //   return {
    //     eventType: WorldEvents.Decision,
    //     eventName: "Decision",
    //     gameId: num.toHexString(raw.keys[1]),
    //     playerId: num.toHexString(raw.keys[2]),
    //     action: Number(raw.data[0]),
    //   } as DecisionEventData;

    // case WorldEvents.Consequence:
    //   return {
    //     eventType: WorldEvents.Consequence,
    //     eventName: "Consequence",
    //     gameId: num.toHexString(raw.keys[1]),
    //     playerId: num.toHexString(raw.keys[2]),
    //     outcome: Number(raw.data[0]),
    //     healthLoss: Number(raw.data[1]),
    //     drugLoss: Number(raw.data[2]),
    //     cashLoss: Number(raw.data[3]),
    //     dmgDealt: Number(raw.data[4]),
    //     cashEarnt: Number(raw.data[5]),
    //   } as ConsequenceEventData;




    // case WorldEvents.GameOver:
    //   return {
    //     eventType: WorldEvents.GameOver,
    //     eventName: "GameOver",
    //     gameId: num.toHexString(raw.keys[1]),
    //     playerId: num.toHexString(raw.keys[2]),
    //     playerName: shortString.decodeShortString(raw.data[0]),
    //     playerStatus: shortString.decodeShortString(raw.data[1]),
    //     turn: Number(raw.data[2]),
    //     cash: Number(raw.data[3]),
    //   } as GameOverEventData;


    default:
      // console.log(`event parse not implemented: ${raw.keys[0]}`)
      //throw new Error(`event parse not implemented: ${eventType}`);
      return {
        gameId: undefined,
        eventType: raw.keys[0],
        eventName: raw.keys[0],
      }
      break;
  }

}


export function displayMarketEvents(events: HighVolatilityData[], toaster: ToastType) {
  // market events
  for (let event of events) {
    const e = event as HighVolatilityData;
    const msg = e.increase
      ? `Pigs seized ${getDrugByType(Number(e.drugId))?.name} in ${getLocationByType(Number(e.locationId))?.name
      }`
      : `A shipment of ${getDrugByType(Number(e.drugId))?.name} has arrived to ${getLocationByType(Number(e.locationId))?.name
      }`;
    const icon = e.increase ? Siren : Truck;
    toaster.toast({
      message: msg,
      icon: icon,
      // link: `http://amazing_explorer/${hash}`,
      duration: 6000,
    });
  }
}