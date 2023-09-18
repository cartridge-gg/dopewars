import { Action, Outcome, PlayerStatus } from "@/dojo/types";
import {
  GetTransactionReceiptResponse,
  InvokeTransactionReceiptResponse,
  num,
} from "starknet";

// events are keyed by the hash of the event name
export enum RyoEvents {
  GameCreated = "0x230f942bb2087887c3b1dd964c716614bb6df172214f22409fefb734d96a4d2",
  PlayerJoined = "0x214916ce0265d355fd91110809ffba7b5e672b108a8beea3dd235818431264b",
  Traveled = "0x2c4d9d5da873550ed167876bf0bc2ae300ce1db2eeff67927a85693680a2328",
  Bought = "0x20cb8131637de1953a75938db3477cc6b648e5ed255f5b3fe3f0fb9299f0afc",
  Sold = "0x123e760cef925d0b4f685db5e1ac87aadaf1ad9f8069122a5bb03353444c386",
  AdverseEvent = "0x3605d6af5b08d01a1b42fa16a5f4dc202724f1664912948dcdbe99f5c93d0a0",
  Decision = "0xc9315f646a66dd126a564fa76bfdc00bdb47abe0d8187e464f69215dbf432a",
  Consequence = "0x1335a57b72e0bcb464f40bf1f140f691ec93e4147b91d0760640c19999b841d",
}

export interface BaseEventData {
  gameId: string;
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
}

export const parseEvent = (
  receipt: GetTransactionReceiptResponse,
  eventType: RyoEvents,
): BaseEventData => {
  if (receipt.status === "REJECTED") {
    throw new Error(`transaction REJECTED`);
  }

  const raw = receipt.events?.find((e) => e.keys[0] === eventType);

  if (!raw) {
    throw new Error(`event not found`);
  }

  switch (eventType) {
    case RyoEvents.GameCreated:
      return {
        gameId: num.toHexString(raw.data[0]),
        creator: num.toHexString(raw.data[1]),
        startTime: Number(raw.data[2]),
        maxTurns: Number(raw.data[3]),
        maxPlayers: Number(raw.data[4]),
      } as CreateEventData;

    case RyoEvents.AdverseEvent:
      return {
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        playerStatus: Number(raw.data[2]),
      } as AdverseEventData;

    case RyoEvents.PlayerJoined:
      return {
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        locationId: num.toHexString(raw.data[2]),
      } as JoinedEventData;
    case RyoEvents.Decision:
      return {
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        action: Number(raw.data[2]),
      } as DecisionEventData;
    case RyoEvents.Consequence:
      return {
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        outcome: Number(raw.data[2]),
      } as ConsequenceEventData;
    case RyoEvents.Traveled:
    case RyoEvents.Bought:
    case RyoEvents.Sold:
      throw new Error(`event parse not implemented: ${eventType}`);
  }
};
