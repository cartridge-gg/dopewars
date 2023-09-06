import { InvokeTransactionReceiptResponse, num, shortString } from "starknet";

// events are keyed by the hash of the event name
export enum RyoEvents {
  GameCreated = "0x230f942bb2087887c3b1dd964c716614bb6df172214f22409fefb734d96a4d2",
  PlayerJoined = "0x214916ce0265d355fd91110809ffba7b5e672b108a8beea3dd235818431264b",
  Traveled = "0x2c4d9d5da873550ed167876bf0bc2ae300ce1db2eeff67927a85693680a2328",
  Bought = "0x20cb8131637de1953a75938db3477cc6b648e5ed255f5b3fe3f0fb9299f0afc",
  Sold = "0x123e760cef925d0b4f685db5e1ac87aadaf1ad9f8069122a5bb03353444c386",
  RandomEvent = "0x203b38ece4b4d98864bf85cb3f5261dad4c45aab6aa5d9228fbda95f7dd4f62",
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

export const parseEvent = (
  receipt: InvokeTransactionReceiptResponse,
  eventType: RyoEvents,
): BaseEventData => {
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
        locationId: num.toHexString(raw.data[2]),
      } as JoinedEventData;

    case RyoEvents.Traveled:
    case RyoEvents.Bought:
    case RyoEvents.Sold:
      throw new Error(`event parse not implemented: ${eventType}`);
  }
};
