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
  bankDeposit: (
    gameId: string,
    quantity: number,
  ) => Promise<SystemExecuteResult>;
  bankWithdraw: (
    gameId: string,
    quantity: number,
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

      return {
        hash: receipt.transaction_hash,
        event,
      };
    },
    [executeAndReceipt],
  );

  const travel = useCallback(
    async (gameId: string, locationName: string) => {
      const receipt = await executeAndReceipt("travel", [gameId, locationName]);
      let result = { hash: receipt.transaction_hash } as SystemExecuteResult;

      try {
        result.event = parseEvent(receipt, RyoEvents.RandomEvent);
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

      return {
        hash: receipt.transaction_hash,
        event,
      };
    },
    [executeAndReceipt],
  );

  const buy = useCallback(
    async (
      gameId: string,
      locationName: string,
      drugName: string,
      quantity: number,
    ) => {
      const receipt = await executeAndReceipt("buy", [
        gameId,
        locationName,
        drugName,
        quantity,
      ]);

      return {
        hash: receipt.transaction_hash,
      };
    },
    [executeAndReceipt],
  );

  const sell = useCallback(
    async (
      gameId: string,
      locationName: string,
      drugName: string,
      quantity: number,
    ) => {
      const receipt = await executeAndReceipt("sell", [
        gameId,
        locationName,
        drugName,
        quantity,
      ]);

      return {
        hash: receipt.transaction_hash,
      };
    },
    [executeAndReceipt],
  );

  const setName = useCallback(
    async (gameId: string, playerName: string) => {
      const receipt = await executeAndReceipt("set_name", [gameId, playerName]);

      return {
        hash: receipt.transaction_hash,
      };
    },
    [executeAndReceipt],
  );

  const bankDeposit = useCallback(
    async (gameId: string, quantity: number) => {
      const receipt = await executeAndReceipt("bank_deposit", [
        gameId,
        quantity,
      ]);
      const event = parseEvent(receipt, RyoEvents.BankDeposit);

      return {
        event,
        hash: receipt.transaction_hash,
      };
    },
    [executeAndReceipt],
  );

  const bankWithdraw = useCallback(
    async (gameId: string, quantity: number) => {
      const receipt = await executeAndReceipt("bank_withdraw", [
        gameId,
        quantity,
      ]);
      const event = parseEvent(receipt, RyoEvents.BankWithdraw);

      return {
        event,
        hash: receipt.transaction_hash,
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
    bankDeposit,
    bankWithdraw,
    error,
    isPending,
  };
};
