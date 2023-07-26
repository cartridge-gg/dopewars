import { BaseEventData, parseEvent, RyoEvents } from "@/utils/event";
import { useCallback } from "react";
import { useDojo } from "..";

export interface SystemsInterface {
  create: (
    startTime: number,
    maxPlayers: number,
    maxTurns: number,
  ) => Promise<SystemExecuteResult>;
  travel: (gameId: string, locationId: string) => Promise<SystemExecuteResult>;
  join: (gameId: string) => Promise<SystemExecuteResult>;
  buy: (
    gameId: string,
    locationName: string,
    drugName: string,
    quantity: number,
  ) => Promise<SystemExecuteResult>;
  sell: (
    gameId: string,
    locationName: string,
    drugName: string,
    quantity: number,
  ) => Promise<SystemExecuteResult>;
  setName: (gameId: string, playerName: string) => Promise<SystemExecuteResult>;
  isPending: boolean;
  error?: Error;
}

export interface SystemExecuteResult {
  hash: string;
  event?: BaseEventData;
}

export const useSystems = (): SystemsInterface => {
  const { execute, account, error, isPending } = useDojo();

  const executeAndReciept = useCallback(
    async (method: string, params: Array<string | number>) => {
      if (!account) {
        throw new Error("No account connected");
      }

      try {
        const hash = await execute(method, params);
        return await account.getTransactionReceipt(hash);
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
      const event = parseEvent(receipt, RyoEvents.PlayerJoined);

      return {
        hash: receipt.transaction_hash,
        event,
      };
    },
    [executeAndReciept],
  );

  const travel = useCallback(
    async (gameId: string, locationName: string) => {
      const receipt = await executeAndReciept("travel", [gameId, locationName]);
      let result = { hash: receipt.transaction_hash } as SystemExecuteResult;

      try {
        result.event = parseEvent(receipt, RyoEvents.RandomEvent);
      } catch (err) {
        // no random event occured
      }

      return result;
    },
    [executeAndReciept],
  );

  const join = useCallback(
    async (gameId: string) => {
      const receipt = await executeAndReciept("join_game", [gameId]);
      const event = parseEvent(receipt, RyoEvents.PlayerJoined);

      return {
        hash: receipt.transaction_hash,
        event,
      };
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
      const receipt = await executeAndReciept("buy", [
        gameId,
        locationName,
        drugName,
        quantity,
      ]);

      return {
        hash: receipt.transaction_hash,
      };
    },
    [executeAndReciept],
  );

  const sell = useCallback(
    async (
      gameId: string,
      locationName: string,
      drugName: string,
      quantity: number,
    ) => {
      const receipt = await executeAndReciept("sell", [
        gameId,
        locationName,
        drugName,
        quantity,
      ]);

      return {
        hash: receipt.transaction_hash,
      };
    },
    [executeAndReciept],
  );

  const setName = useCallback(
    async (gameId: string, playerName: string) => {
      const receipt = await executeAndReciept("set_name", [gameId, playerName]);

      return {
        hash: receipt.transaction_hash,
      };
    },
    [executeAndReciept],
  );

  return {
    create,
    join,
    travel,
    buy,
    sell,
    setName,
    error,
    isPending,
  };
};
