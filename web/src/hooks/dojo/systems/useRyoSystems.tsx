import { InvokeTransactionReceiptResponse, num, shortString } from "starknet";
import { useDojo } from "..";
import { TradeDirection } from "../../state";

export enum RyoEvents {
  GameCreated = "GameCreated",
  PlayerJoined = "PlayerJoined",
  Traveled = "Traveled",
  Bought = "Bought",
  Sold = "Sold",
  RandomEvent = "RandomEvent",
}

export interface RyoSystemsInterface {
  create: (
    startTime: number,
    maxPlayers: number,
    maxTurns: number,
  ) => Promise<{ gameId: string; locationName: string }>;
  join: (gameId: string) => Promise<void>;
  travel: (gameId: string, locationId: string) => Promise<void>;
  trade: (
    gameId: string,
    locationId: string,
    drugId: string,
    quantity: number,
    direction: TradeDirection,
  ) => Promise<void>;
  isPending: boolean;
}

export const useRyoSystems = (): RyoSystemsInterface => {
  const { execute, account, isPending } = useDojo();

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
    isPending,
  };
};

const parseJoinedEvent = (
  receipt: InvokeTransactionReceiptResponse,
): { gameId: string; playerId: string; locationName: string } => {
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
