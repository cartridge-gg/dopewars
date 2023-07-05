import { InvokeTransactionReceiptResponse, num, shortString } from "starknet";
import { useDojo } from "./dojo";
import { TradeDirection } from "./state";

export enum RyoEvents {
  GameCreated = "GameCreated",
  PlayerJoined = "PlayerJoined",
  Traveled = "Traveled",
  Bought = "Bought",
  Sold = "Sold",
  RandomEvent = "RandomEvent",
}

export interface RyoWorldInterface {
  create: (
    startTime: number,
    maxPlayers: number,
    maxTurns: number,
  ) => Promise<string>;
  join: (gameId: string) => Promise<void>;
  travel: (gameId: string, locationId: string) => Promise<void>;
  trade: (
    gameId: string,
    locationId: string,
    drugId: string,
    quantity: number,
    direction: TradeDirection,
  ) => Promise<void>;
}

export const useRyoWorld = (): RyoWorldInterface => {
  const { execute, account } = useDojo();

  const create = async (
    startTime: number,
    maxPlayers: number,
    maxTurns: number,
  ) => {
    const txn = await execute("create_game", [startTime, maxPlayers, maxTurns]);
    const receipt = await account.getTransactionReceipt(txn);

    return parseGameId(receipt);
  };

  const join = async (gameId: string) => {
    await execute("join_game", [gameId]);
  };

  const travel = async (gameId: string, locationId: string) => {
    await execute("travel", [gameId, locationId]);
  };

  const trade = async (
    gameId: string,
    locationId: string,
    drugId: string,
    quantity: number,
    direction: TradeDirection,
  ) => {
    await execute("trade", [gameId, locationId, drugId, quantity, direction]);
  };

  return {
    create,
    join,
    trade,
    travel,
  };
};

const parseGameId = (receipt: InvokeTransactionReceiptResponse): string => {
  const event = receipt.events?.find(
    (event) =>
      shortString.decodeShortString(event.keys[0]) === RyoEvents.GameCreated,
  );

  if (!event) {
    throw new Error("No GameCreated event found in receipt");
  }

  return num.toHexString(event.data[0]);
};
