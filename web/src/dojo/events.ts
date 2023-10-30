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

export interface BaseEventData {
  gameId: string;
  eventType: WorldEvents
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
  gameId: string;
  playerId: string;
  playerName: string;
}

export interface BoughtEventData extends BaseEventData {
  playerId: string;
  drugId: string;
  quantity: number;
  price: number;
}

export interface SoldEventData extends BaseEventData {
  playerId: string;
  drugId: string;
  quantity: number;
  price: number;
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
}

export interface MarketEventData extends BaseEventData {
  gameId: string;
  locationId: string;
  drugId: string;
  increase: boolean;
}


export const parseAllEvents = (receipt: GetTransactionReceiptResponse) => {
  if (receipt.status === "REJECTED") {
    throw new Error(`transaction REJECTED`);
  }
  if (receipt.status === "REVERTED") {
    throw new Error(`transaction REVERTED`);
  }

  const allEvents = []
  for (let eventType of Object.values(WorldEvents)) {
    allEvents.push(parseEvents((receipt as SuccessfulTransactionReceiptResponse), eventType))
  }

  return allEvents.flat()
}

export const parseEvents = (receipt: SuccessfulTransactionReceiptResponse, eventType: WorldEvents) => {
  const events = receipt.events.filter(e => e.keys[0] === eventType)
  return events.map(e => parseEvent(e, eventType))
}

export const parseEvent = (raw: any, eventType: WorldEvents) => {

  switch (eventType) {
    case WorldEvents.GameCreated:
      return {
        eventType,
        gameId: num.toHexString(raw.data[0]),
        creator: num.toHexString(raw.data[1]),
        startTime: Number(raw.data[2]),
        maxTurns: Number(raw.data[3]),
        maxPlayers: Number(raw.data[4]),
      } as CreateEventData;

    case WorldEvents.AdverseEvent:
      return {
        eventType,
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        playerStatus: shortString.decodeShortString(raw.data[2]),
        healthLoss:  Number(raw.data[3]),
      } as AdverseEventData;

    case WorldEvents.AtPawnshop:
      return {
        eventType,
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
      } as AtPawnshopEventData;

    case WorldEvents.PlayerJoined:
      return {
        eventType,
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        playerName: shortString.decodeShortString(raw.data[1]),
      } as JoinedEventData;

    case WorldEvents.Decision:
      return {
        eventType,
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        action: Number(raw.data[2]),
      } as DecisionEventData;

    case WorldEvents.Consequence:
      return {
        eventType,
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        outcome: Number(raw.data[2]),
        healthLoss: Number(raw.data[3]),
        drugLoss: Number(raw.data[4]),
        cashLoss: Number(raw.data[5]),
        dmgDealt:  Number(raw.data[6]),
      } as ConsequenceEventData;
      
    case WorldEvents.MarketEvent:
      return {
        eventType,
        gameId: num.toHexString(raw.data[0]),
        locationId: num.toHexString(raw.data[1]),
        drugId: num.toHexString(raw.data[2]),
        increase: raw.data[3] === "0x0" ? false : true,
      } as MarketEventData;

    case WorldEvents.Traveled:
    case WorldEvents.Bought:
    case WorldEvents.Sold:
    default:
      console.log(`event parse not implemented: ${eventType}`)
      //throw new Error(`event parse not implemented: ${eventType}`);
      return {
        eventType,
      }
      break;
  }

}


export function displayMarketEvents(events: MarketEventData[], toast: ToastType) {
  // market events
  for (let event of events) {
    const e = event as MarketEventData;
    const msg = e.increase
      ? `Pigs seized ${getDrugByType(Number(e.drugId))?.name} in ${getLocationByType(Number(e.locationId))?.name
      }`
      : `A shipment of ${getDrugByType(Number(e.drugId))?.name} has arrived to ${getLocationByType(Number(e.locationId))?.name
      }`;
    const icon = e.increase ? Siren : Truck;
    toast({
      message: msg,
      icon: icon,
      // link: `http://amazing_explorer/${hash}`,
      duration: 6000,
    });
  }
}