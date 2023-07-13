import { BaseEventData, parseEvent, RyoEvents } from "@/utils/event";
import { useCallback } from "react";
import { useDojo } from "..";

export interface RyoSystemsInterface {
  create: (
    startTime: number,
    maxPlayers: number,
    maxTurns: number,
  ) => Promise<BaseEventData>;
  travel: (gameId: string, locationId: string) => Promise<BaseEventData | void>;
  join: (gameId: string) => Promise<BaseEventData>;
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

  const executeAndReciept = useCallback(
    async (method: string, params: Array<string | number>) => {
      try {
        const txn = await execute(method, params);
        return await account.getTransactionReceipt(txn);
      } catch (err) {
        console.error(`Error execute ${method}`, err);
        throw err;
      }
    },
    [execute, account],
  );

  const create = useCallback(
    async (startTime: number, maxPlayers: number, maxTurns: number) => {
      const receipt = await executeAndReciept("create_game", [
        startTime,
        maxPlayers,
        maxTurns,
      ]);

      // using joined event instead of created event to get initial location
      return parseEvent(receipt, RyoEvents.PlayerJoined);
    },
    [executeAndReciept],
  );

  const travel = useCallback(
    async (gameId: string, locationName: string) => {
      const receipt = await executeAndReciept("travel", [gameId, locationName]);

      try {
        return parseEvent(receipt, RyoEvents.RandomEvent);
      } catch (err) {
        // no random event occured
      }
    },
    [executeAndReciept],
  );

  const join = useCallback(
    async (gameId: string) => {
      const receipt = await executeAndReciept("join_game", [gameId]);
      return parseEvent(receipt, RyoEvents.PlayerJoined);
    },
    [executeAndReciept],
  );

  const buy = useCallback(
    async (
      gameId: string,
      locationName: string,
      drugName: string,
      quantity: number,
    ) => {
      await execute("buy", [gameId, locationName, drugName, quantity]);
    },
    [execute],
  );

  const sell = useCallback(
    async (
      gameId: string,
      locationName: string,
      drugName: string,
      quantity: number,
    ) => {
      await execute("sell", [gameId, locationName, drugName, quantity]);
    },
    [execute],
  );

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
