import { InvokeTransactionReceiptResponse, num, shortString } from "starknet";

export enum RyoEvents {
  GameCreated = "GameCreated",
  PlayerJoined = "PlayerJoined",
  Traveled = "Traveled",
  Bought = "Bought",
  Sold = "Sold",
  RandomEvent = "RandomEvent",
}

export interface BaseEventData {
  gameId: string;
}

export interface RandomEventData extends BaseEventData {
  playerId: string;
  healthLoss: number;
  mugged: boolean;
  arrested: boolean;
}

export interface CreateEventData extends BaseEventData {
  creator: string;
  startTime: number;
  maxTurns: number;
  maxPlayers: number;
}

export interface JoinedEventData extends BaseEventData {
  playerId: string;
  locationName: string;
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

export const parseEvent = (
  receipt: InvokeTransactionReceiptResponse,
  eventType: RyoEvents,
): BaseEventData => {
  const raw = receipt.events?.find(
    (e) => shortString.decodeShortString(e.keys[0]) === eventType,
  );

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

    case RyoEvents.RandomEvent:
      return {
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        healthLoss: Number(raw.data[2]),
        mugged: Boolean(raw.data[3] === "0x1"),
        arrested: Boolean(raw.data[4] === "0x1"),
      } as RandomEventData;

    case RyoEvents.PlayerJoined:
      return {
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        locationName: shortString.decodeShortString(raw.data[2]),
      } as JoinedEventData;

    case RyoEvents.Traveled:
    case RyoEvents.Bought:
    case RyoEvents.Sold:
      throw new Error(`event parse not implemented: ${eventType}`);
  }
};
