import { InvokeTransactionReceiptResponse, num, shortString } from "starknet";
import { useDojo } from "..";

export enum RyoEvents {
  GameCreated = "GameCreated",
  PlayerJoined = "PlayerJoined",
  Traveled = "Traveled",
  Bought = "Bought",
  Sold = "Sold",
  RandomEvent = "RandomEvent",
}

export interface RandomEventResult {
  gameId: string;
  playerId: string;
  health_loss: number;
  money_loss: number;
  arrested: boolean;
}

export interface CreateEventResult {
  gameId: string;
  playerId: string;
  locationName: string;
}

export interface RyoSystemsInterface {
  create: (
    startTime: number,
    maxPlayers: number,
    maxTurns: number,
  ) => Promise<CreateEventResult>;
  join: (gameId: string) => Promise<void>;
  travel: (
    gameId: string,
    locationId: string,
  ) => Promise<RandomEventResult | void>;
  buy: (
    gameId: string,
    locationName: string,
    drugName: string,
    quantity: number,
  ) => Promise<void>;
  sell: (
    gameId: string,
    locationName: string,
    drugName: string,
    quantity: number,
  ) => Promise<void>;
  isPending: boolean;
  error?: Error;
}

export const useRyoSystems = (): RyoSystemsInterface => {
  const { execute, account, error, isPending } = useDojo();

  const create = async (
    startTime: number,
    maxPlayers: number,
    maxTurns: number,
  ) => {
    const txn = await execute("create_game", [startTime, maxPlayers, maxTurns]);
    const receipt = await account.getTransactionReceipt(txn);

    return parseJoinedEvent(receipt);
  };

  const join = async (gameId: string) => {
    await execute("join_game", [gameId]);
  };

  const travel = async (gameId: string, locationName: string) => {
    const txn = await execute("travel", [gameId, locationName]);
    const receipt = await account.getTransactionReceipt(txn);

    return parseRandomEvent(receipt);
  };

  const buy = async (
    gameId: string,
    locationName: string,
    drugName: string,
    quantity: number,
  ) => {
    await execute("buy", [gameId, locationName, drugName, quantity]);
  };

  const sell = async (
    gameId: string,
    locationName: string,
    drugName: string,
    quantity: number,
  ) => {
    await execute("sell", [gameId, locationName, drugName, quantity]);
  };

  return {
    create,
    join,
    travel,
    buy,
    sell,
    error,
    isPending,
  };
};

const parseRandomEvent = (
  receipt: InvokeTransactionReceiptResponse,
): RandomEventResult | void => {
  const event = receipt.events?.find(
    (event) =>
      shortString.decodeShortString(event.keys[0]) === RyoEvents.RandomEvent,
  );

  if (event) {
    return {
      gameId: num.toHexString(event.data[0]),
      playerId: num.toHexString(event.data[1]),
      health_loss: Number(event.data[2]),
      money_loss: Number(event.data[3]),
      arrested: Boolean(event.data[4]),
    };
  }
};

const parseJoinedEvent = (
  receipt: InvokeTransactionReceiptResponse,
): CreateEventResult => {
  const event = receipt.events?.find(
    (event) =>
      shortString.decodeShortString(event.keys[0]) === RyoEvents.PlayerJoined,
  );

  if (!event) {
    throw new Error("No PlayerJoined event found in receipt");
  }

  return {
    gameId: num.toHexString(event.data[0]),
    playerId: num.toHexString(event.data[1]),
    locationName: shortString.decodeShortString(num.toHexString(event.data[2])),
  };
};
