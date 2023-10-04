import { useCallback } from "react";
import { useDojoContext } from "./useDojoContext";
// import { BaseEventData, parseEvent, parseEvents, WorldEvents } from "../events";
import { Action, GameMode } from "../types";
import { shortString, GetTransactionReceiptResponse } from "starknet";
import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";
import { parseAllEvents } from "../events";
import { WorldEvents } from "../generated/contractEvents";

export interface SystemsInterface {
  createGame: (
    gameMode: number,
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
  events?: BaseEventData[];
}

export const useSystems = (): SystemsInterface => {
  const {
    account,
    setup: {
      network: { provider, execute },
    },
  } = useDojoContext();

  const executeAndReceipt = useCallback(
    async (
      contract: string,
      system: string,
      callData: BigNumberish[],
    ): {
      hash: string;
      receipt: GetTransactionReceiptResponse;
      events: any[];
      parsedEvents: any[];
    } => {
      const tx = await execute(account, contract, system, callData);
      const receipt = await account.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });
      const events = getEvents(receipt);
      const parsedEvents = parseAllEvents(receipt);

      // useless
      // setComponentsFromEvents(contractComponents, events);

      return {
        hash: tx.transaction_hash,
        receipt,
        events,
        parsedEvents,
      };
    },
    [execute, account],
  );

  const createGame = useCallback(
    async (gameMode: GameMode, playerName: string) => {
      const { hash, receipt, events, parsedEvents } = await executeAndReceipt(
        "lobby",
        "create_game",
        [gameMode, playerName],
      );

      const joinedEvent = parsedEvents.find(
        (e) => e.eventType === WorldEvents.PlayerJoined,
      ) as JoinedEventData;

      return {
        hash,
        gameId: joinedEvent.gameId,
      };
    },
    [executeAndReceipt],
  );

  const travel = useCallback(
    async (gameId: string, locationId: string) => {
      const { hash, receipt, events, parsedEvents } = await executeAndReceipt(
        account,
        "travel",
        "travel",
        [gameId, locationId],
      );

      return {
        hash,
        event: parsedEvents.find(
          (e) => e.eventType === WorldEvents.AdverseEvent,
        ) as AdverseEventData,
        events: parsedEvents
          .filter((e) => e.eventType === WorldEvents.MarketEvent)
          .map((e) => e as MarketEventData),
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
      const { hash, receipt, events, parsedEvents } = await executeAndReceipt(
        account,
        "trade",
        "buy",
        [gameId, locationId, drugId, quantity],
      );

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
      const { hash, receipt, events, parsedEvents } = await executeAndReceipt(
        account,
        "trade",
        "sell",
        [gameId, locationId, drugId, quantity],
      );

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const decide = useCallback(
    async (gameId: string, action: Action, nextLocationId: string) => {
      const { hash, receipt, events, parsedEvents } = await executeAndReceipt(
        account,
        "decide",
        "decide",
        [gameId, action, nextLocationId],
      );

      return {
        hash,
        event: parsedEvents.find(
          (e) => e.eventType === WorldEvents.Consequence,
        ) as ConsequenceEventData,
      };
    },
    [executeAndReceipt],
  );

  const setName = useCallback(
    async (gameId: string, playerName: string) => {
      const { hash, receipt, events, parsedEvents } = await executeAndReceipt(
        account,
        "lobby",
        "set_name",
        [gameId, playerName],
      );

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  return {
    createGame,
    // join,
    travel,
    buy,
    sell,
    setName,
    decide,
    // error,
    // isPending,
  };
};
