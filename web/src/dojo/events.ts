import { Action, Outcome, PlayerStatus } from "@/dojo/types";
import {
  GetTransactionReceiptResponse,
  InvokeTransactionReceiptResponse,
  num,
  shortString
} from "starknet";

import { WorldEvents } from "./generated/contractEvents";

export interface BaseEventData {
  gameId: string;
  eventType: WorldEvents
}

export interface AdverseEventData extends BaseEventData {
  playerId: string;
  playerStatus: PlayerStatus;
}

export interface CreateEventData extends BaseEventData {
  creator: string;
  startTime: number;
  maxTurns: number;
  maxPlayers: number;
}

export interface JoinedEventData extends BaseEventData {
  playerId: string;
  locationId: string;
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

  const allEvents = []
  for (let eventType of Object.values(WorldEvents)) {
    allEvents.push(parseEvents(receipt, eventType))
  }
  return allEvents.flat()
}

export const parseEvents = (receipt: GetTransactionReceiptResponse, eventType: WorldEvents) => {
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
        playerStatus: Number(raw.data[2]),
      } as AdverseEventData;

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
    case WorldEvents.MarketEvent:
      console.log(`event parse not implemented: ${eventType}`)
      //throw new Error(`event parse not implemented: ${eventType}`);
      return {
        eventType,
      }
      break;
  }

}
