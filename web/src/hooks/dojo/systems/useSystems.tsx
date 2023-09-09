import { Action } from "@/hooks/state";
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
    locationId: string,
    drugId: string,
    quantity: number,
  ) => Promise<SystemExecuteResult>;
  sell: (
    gameId: string,
    locationId: string,
    drugId: string,
    quantity: number,
  ) => Promise<SystemExecuteResult>;
  setName: (gameId: string, playerName: string) => Promise<SystemExecuteResult>;
  decide: (
    gameId: string,
    action: Action,
    nextLocationId: string,
  ) => Promise<SystemExecuteResult>;
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
    async (gameId: string, locationId: string) => {
      const receipt = await executeAndReciept("travel", [gameId, locationId]);
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
      locationId: string,
      drugId: string,
      quantity: number,
    ) => {
      const receipt = await executeAndReciept("buy", [
        gameId,
        locationId,
        drugId,
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
      locationId: string,
      drugId: string,
      quantity: number,
    ) => {
      const receipt = await executeAndReciept("sell", [
        gameId,
        locationId,
        drugId,
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

  const decide = useCallback(
    async (gameId: string, action: Action, nextLocationId: string) => {
      const receipt = await executeAndReciept("decide", [
        gameId,
        action,
        nextLocationId,
      ]);

      const event = parseEvent(receipt, RyoEvents.Consqeuence);

      return {
        hash: receipt.transaction_hash,
        event,
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
    decide,
    error,
    isPending,
  };
};
