import { useCallback } from "react";
import { useDojo } from "..";
import { BaseEventData, parseEvent, RyoEvents } from "../events";
import { Action } from "../types";
import { shortString } from "starknet";

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

  const executeAndReceipt = useCallback(
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
      const receipt = await executeAndReceipt("create_game", [
        startTime,
        maxPlayers,
        maxTurns,
      ]);

      // using joined event instead of created event to get initial location
      const event = parseEvent(receipt, RyoEvents.PlayerJoined);
      const hash =
        "transaction_hash" in receipt ? receipt.transaction_hash : "";

      return {
        hash,
        event,
      };
    },
    [executeAndReceipt],
  );

  const travel = useCallback(
    async (gameId: string, locationId: string) => {
      const receipt = await executeAndReceipt("travel", [gameId, locationId]);

      const hash =
        "transaction_hash" in receipt ? receipt.transaction_hash : "";
      let result = { hash } as SystemExecuteResult;

      try {
        result.event = parseEvent(receipt, RyoEvents.AdverseEvent);
      } catch (err) {
        // no random event occured
      }

      return result;
    },
    [executeAndReceipt],
  );

  const join = useCallback(
    async (gameId: string) => {
      const receipt = await executeAndReceipt("join_game", [gameId]);

      const event = parseEvent(receipt, RyoEvents.PlayerJoined);
      const hash =
        "transaction_hash" in receipt ? receipt.transaction_hash : "";

      return {
        hash,
        event,
      };
    },
    [executeAndReceipt],
  );

  const buy = useCallback(
    async (
      gameId: string,
      locationId: string,
      drugId: string,
      quantity: number,
    ) => {
      const receipt = await executeAndReceipt("buy", [
        gameId,
        locationId,
        drugId,
        quantity,
      ]);
      const hash =
        "transaction_hash" in receipt ? receipt.transaction_hash : "";

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const sell = useCallback(
    async (
      gameId: string,
      locationId: string,
      drugId: string,
      quantity: number,
    ) => {
      const receipt = await executeAndReceipt("sell", [
        gameId,
        locationId,
        drugId,
        quantity,
      ]);
      const hash =
        "transaction_hash" in receipt ? receipt.transaction_hash : "";

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const setName = useCallback(
    async (gameId: string, playerName: string) => {
      // not working if name is number only
      const name =  shortString.encodeShortString(playerName);
      debugger
      const receipt = await executeAndReceipt("set_name", [gameId, name]);
      const hash =
        "transaction_hash" in receipt ? receipt.transaction_hash : "";

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const decide = useCallback(
    async (gameId: string, action: Action, nextLocationId: string) => {
      const receipt = await executeAndReceipt("decide", [
        gameId,
        action,
        nextLocationId,
      ]);

      const event = parseEvent(receipt, RyoEvents.Consequence);
      const hash =
        "transaction_hash" in receipt ? receipt.transaction_hash : "";
      return {
        hash,
        event,
      };
    },
    [executeAndReceipt],
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
