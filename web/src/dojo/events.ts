import { Action, Outcome, PlayerStatus } from "@/dojo/types";
import {
  GetTransactionReceiptResponse,
  InvokeTransactionReceiptResponse,
  SuccessfulTransactionReceiptResponse,
  num,
  shortString
} from "starknet";

import { WorldEvents } from "./generated/contractEvents";
import { Siren, Truck } from "@/components/icons";
import { getLocationByType, getDrugByType } from "./helpers"
import { ToastType } from "@/hooks/toast";

export interface BaseEventData {
  gameId: string;
  eventType: WorldEvents;
  eventName: string;
}

export interface AdverseEventData extends BaseEventData {
  playerId: string;
  playerStatus: PlayerStatus;
  healthLoss: number;
}

export interface AtPawnshopEventData extends BaseEventData {
  playerId: string;
}

export interface CreateEventData extends BaseEventData {
  creator: string;
  startTime: number;
  maxTurns: number;
  maxPlayers: number;
}

export interface JoinedEventData extends BaseEventData {
  playerId: string;
  playerName: string;
}

export interface BoughtEventData extends BaseEventData {
  playerId: string;
  drugId: string;
  quantity: number;
  cost: number;
}

export interface SoldEventData extends BaseEventData {
  playerId: string;
  drugId: string;
  quantity: number;
  payout: number;
}

export interface DecisionEventData extends BaseEventData {
  playerId: string;
  action: Action;
}

export interface ConsequenceEventData extends BaseEventData {
  playerId: string;
  outcome: Outcome;
  healthLoss: number;
  drugLoss: number;
  cashLoss: number;
  dmgDealt: number;
}

export interface MarketEventData extends BaseEventData {
  locationId: string;
  drugId: string;
  increase: boolean;
}

export interface TraveledEventData extends BaseEventData {
  playerId: string;
  turn: number;
  increase: boolean;
  fromLocation: string;
  toLocation: string;
}

export interface BoughtItemEventData extends BaseEventData {
  playerId: string;
  itemId: string;
  level: number;
  cost: number;
}

export interface GameOverEventData extends BaseEventData {
  playerId: string;
  playerName: string;
  turn: number;
  cash: number;
}


export const parseAllEvents = (receipt: GetTransactionReceiptResponse) => {
  if (receipt.status === "REJECTED") {
    throw new Error(`transaction REJECTED`);
  }
  if (receipt.status === "REVERTED") {
    throw new Error(`transaction REVERTED`);
  }

  const flatEvents = parseEvents(receipt as SuccessfulTransactionReceiptResponse)
  return flatEvents
}

export const parseEvents = (receipt: SuccessfulTransactionReceiptResponse) => {
  const parsed = receipt.events.map(e => parseEvent(e))
  return parsed
}

export const parseEventsByEventType = (receipt: SuccessfulTransactionReceiptResponse, eventType: WorldEvents) => {
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
        gameId: num.toHexString(raw.data[0]),
        creator: num.toHexString(raw.data[1]),
        startTime: Number(raw.data[2]),
      } as CreateEventData;

    case WorldEvents.AdverseEvent:
      return {
        eventType: WorldEvents.AdverseEvent,
        eventName: "AdverseEvent",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        playerStatus: shortString.decodeShortString(raw.data[0]),
        healthLoss: Number(raw.data[1]),
        demandPct: Number(raw.data[2]),
      } as AdverseEventData;

    case WorldEvents.AtPawnshop:
      return {
        eventType: WorldEvents.AtPawnshop,
        eventName: "AtPawnshop",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
      } as AtPawnshopEventData;

    case WorldEvents.PlayerJoined:
      return {
        eventType: WorldEvents.PlayerJoined,
        eventName: "PlayerJoined",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        playerName: shortString.decodeShortString(raw.data[0]),
      } as JoinedEventData;

    case WorldEvents.Decision:
      return {
        eventType: WorldEvents.Decision,
        eventName: "Decision",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        action: Number(raw.data[0]),
      } as DecisionEventData;

    case WorldEvents.Consequence:
      return {
        eventType: WorldEvents.Consequence,
        eventName: "Consequence",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        outcome: Number(raw.data[0]),
        healthLoss: Number(raw.data[1]),
        drugLoss: Number(raw.data[2]),
        cashLoss: Number(raw.data[3]),
        dmgDealt: Number(raw.data[4]),
      } as ConsequenceEventData;

    case WorldEvents.MarketEvent:
      return {
        eventType: WorldEvents.MarketEvent,
        eventName: "MarketEvent",
        gameId: num.toHexString(raw.data[0]),
        locationId: num.toHexString(raw.data[1]),
        drugId: num.toHexString(raw.data[2]),
        increase: raw.data[3] === "0x0" ? false : true,
      } as MarketEventData;

    case WorldEvents.Traveled:
      return {
        eventType: WorldEvents.Traveled,
        eventName: "Traveled",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        turn: Number(raw.data[0]),
        fromLocation: shortString.decodeShortString(raw.data[1]),
        toLocation: shortString.decodeShortString(raw.data[2]),
      } as TraveledEventData;

    case WorldEvents.Bought:
      return {
        eventType: WorldEvents.Bought,
        eventName: "Bought",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        drugId: num.toHexString(raw.data[0]),
        quantity: Number(raw.data[1]),
        cost: Number(raw.data[2]),
      } as BoughtEventData;

    case WorldEvents.Sold:
      return {
        eventType: WorldEvents.Sold,
        eventName: "Sold",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        drugId: num.toHexString(raw.data[0]),
        quantity: Number(raw.data[1]),
        payout: Number(raw.data[2]),
      } as SoldEventData;

    case WorldEvents.BoughtItem:
      return {
        eventType: WorldEvents.BoughtItem,
        eventName: "BoughtItem",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        itemId: num.toHexString(raw.data[0]),
        level: Number(raw.data[1]),
        cost: Number(raw.data[2]),
      } as BoughtItemEventData;

    case WorldEvents.GameOver:
      return {
        eventType: WorldEvents.GameOver,
        eventName: "GameOver",
        gameId: num.toHexString(raw.keys[1]),
        playerId: num.toHexString(raw.keys[2]),
        playerName: shortString.decodeShortString(raw.data[0]),
        playerStatus: shortString.decodeShortString(raw.data[1]),
        turn: Number(raw.data[2]),
        cash: Number(raw.data[3]),
      } as GameOverEventData;


    default:
      console.log(`event parse not implemented: ${raw.keys[0]}`)
      //throw new Error(`event parse not implemented: ${eventType}`);
      return {
        gameId: undefined,
        eventType: raw.keys[0],
        eventName: raw.keys[0],
      }
      break;
  }

}


export function displayMarketEvents(events: MarketEventData[], toaster: ToastType) {
  // market events
  for (let event of events) {
    const e = event as MarketEventData;
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