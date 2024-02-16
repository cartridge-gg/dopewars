import { EncounterOutcomes, EncountersAction } from "@/dojo/types";
import {
  GetTransactionReceiptResponse,
  InvokeTransactionReceiptResponse,
  num,
  shortString
} from "starknet";

import { WorldEvents } from "./generated/contractEvents";

export interface BaseEventData {
  gameId: string;
  eventType: WorldEvents;
  eventName: string;
}


export interface GameCreatedData extends BaseEventData {
  playerId: string;
  gameMode: number;
  playerName: string;
}

export interface TraveledData extends BaseEventData {
  playerId: string;
  turn: number;
  fromLocationId: number;
  toLocationId: number;
}

export interface TradeDrugData extends BaseEventData {
  playerId: string;
  drugId: number;
  quantity: number;
  price: number;
  isBuy: boolean;
}

export interface HighVolatilityData extends BaseEventData {
  playerId: string;
  locationId: number;
  drugId: number;
  increase: boolean;
}

export interface UpgradeItemData extends BaseEventData {
  playerId: string;
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

export interface TravelEncounterResultData extends BaseEventData {
  playerId: string;
  action: EncountersAction;
  outcome: EncounterOutcomes;
  rounds: number;
  dmgDealt: number;
  dmgTaken: number;
  cashEarnt: number;
  cashLoss: number;
  drugId: number;
  drugLoss: number;
}


export interface GameOverData extends BaseEventData {
  playerId: string;
  playerName: string;
  leaderboardVersion: string;
  avatarId: number;
  turn: number;
  cash: number;
  health: number;
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
      } as GameCreatedData;

    case WorldEvents.Traveled:
      return {
        eventType: WorldEvents.Traveled,
        eventName: "Traveled",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        turn: Number(raw.data[0]),
        fromLocationId: Number(raw.data[1]),
        toLocationId: Number(raw.data[2]),
      } as TraveledData;


    case WorldEvents.TradeDrug:
      return {
        eventType: WorldEvents.TradeDrug,
        eventName: "TradeDrug",
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
        locationId: Number(raw.data[0]),
        drugId: Number(raw.data[1]),
        increase: raw.data[2] === "0x0" ? false : true,
      } as HighVolatilityData;


    case WorldEvents.UpgradeItem:
      return {
        eventType: WorldEvents.UpgradeItem,
        eventName: "UpgradeItem",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        itemSlot: Number(raw.data[0]),
        itemLevel: Number(raw.data[1]),
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


    case WorldEvents.TravelEncounterResult:
      return {
        eventType: WorldEvents.TravelEncounterResult,
        eventName: "TravelEncounterResult",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        action: Number(raw.data[0]) as EncountersAction,
        outcome: Number(raw.data[1]) as EncounterOutcomes,
        rounds: Number(raw.data[2]),
        dmgDealt: Number(raw.data[3]),
        dmgTaken: Number(raw.data[4]),
        cashEarnt: Number(raw.data[5]),
        cashLoss: Number(raw.data[6]),
        drugId: Number(raw.data[7]),
        drugLoss: Number(raw.data[8]),
      } as TravelEncounterResultData;


    case WorldEvents.GameOver:
      return {
        eventType: WorldEvents.GameOver,
        eventName: "GameOver",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        leaderboardVersion: num.toHexString(raw.keys[3]),
        playerName: shortString.decodeShortString(raw.data[0]),
        avatarId: Number(raw.data[1]),
        turn: Number(raw.data[2]),
        cash: Number(raw.data[3]),
        health: Number(raw.data[4]),
      } as GameOverData;


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

