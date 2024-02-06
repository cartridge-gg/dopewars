import { useToast } from "@/hooks/toast";
import { getEvents } from "@dojoengine/utils";
import { useCallback, useState } from "react";
import { BigNumberish, GetTransactionReceiptResponse, RejectedTransactionReceiptResponse, RevertedTransactionReceiptResponse } from "starknet";
import { AdverseEventData, AtPawnshopEventData, BaseEventData, ConsequenceEventData, GameCreatedEventData, HighVolatilityData, parseAllEvents } from "../events";
import { WorldEvents } from "../generated/contractEvents";
import { Action, Drug, GameMode, Location, ShopAction, Trade } from "../types";
import { useDojoContext } from "./useDojoContext";

export interface SystemsInterface {
  createGame: (
    gameMode: number,
    playerName: string,
    avatarId: number,
  ) => Promise<SystemExecuteResult>;
  travel: (gameId: string, locationId: Location) => Promise<SystemExecuteResult>;
  endGame: (gameId: string) => Promise<SystemExecuteResult>;
  // join: (gameId: string) => Promise<SystemExecuteResult>;
  trade: (gameId: string, trades: Array<Trade>) => Promise<SystemExecuteResult>;
  shop: (gameId: string, actions: Array<ShopAction>) => Promise<SystemExecuteResult>;
  buy: (
    gameId: string,
    locationId: Location,
    drugId: Drug,
    quantity: number,
  ) => Promise<SystemExecuteResult>;
  sell: (
    gameId: string,
    locationId: Location,
    drugId: Drug,
    quantity: number,
  ) => Promise<SystemExecuteResult>;
  // setName: (gameId: string, playerName: string) => Promise<SystemExecuteResult>;
  decide: (
    gameId: string,
    action: Action,
  ) => Promise<SystemExecuteResult>;
  buyItem: (
    gameId: string, itemId: number
  ) => Promise<SystemExecuteResult>;
  skipShop: (
    gameId: string,
  ) => Promise<SystemExecuteResult>;

  failingTx: () => Promise<SystemExecuteResult>;

  isPending: boolean;
  error?: string;
}

export interface SystemExecuteResult {
  hash: string;
  isGameOver?: BaseEventData;
  event?: BaseEventData;
  events?: BaseEventData[];
  [key: string]: any;
}


const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const tryBetterErrorMsg = (msg: string): string => {

  const failureReasonIndex = msg.indexOf("Failure reason")
  if (failureReasonIndex > 0) {
    let betterMsg = msg.substring(failureReasonIndex)
    const cairoTracebackIndex = betterMsg.indexOf("Cairo traceback")
    betterMsg = betterMsg.substring(0, cairoTracebackIndex)
    return betterMsg
  }

  return msg;

}


export const useSystems = (): SystemsInterface => {
  const {
    account,
    dojoProvider
  } = useDojoContext();

  const { toast } = useToast();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const executeAndReceipt = useCallback(
    async (
      contract: string,
      system: string,
      callData: BigNumberish[],
    ): Promise<{
      hash: string;
      receipt: GetTransactionReceiptResponse;
      events: any[];
      parsedEvents: any[];
    }> => {

      setError(undefined)
      setIsPending(true)

      let tx, receipt;
      try {
        tx = await dojoProvider.execute(account!, contract, system, callData);
        receipt = await account!.waitForTransaction(tx.transaction_hash, {
          retryInterval: 100,
        });
      } catch (e: any) {
        setIsPending(false)
        setError(e.toString())
        toast({
          message: tryBetterErrorMsg(e.toString()),
          duration: 20_000,
          isError: true
        })
        throw Error(e.toString())
      }


      if (receipt.status === "REJECTED") {
        setError("Transaction Rejected")
        setIsPending(false)
        toast({
          message: tryBetterErrorMsg((receipt as RejectedTransactionReceiptResponse).transaction_failure_reason.error_message),
          duration: 20_000,
          isError: true
        })
        throw Error((receipt as RejectedTransactionReceiptResponse).transaction_failure_reason.error_message)
      }

      if (receipt.execution_status === "REVERTED") {
        setError("Transaction Reverted")
        setIsPending(false)

        toast({
          message: tryBetterErrorMsg((receipt as RevertedTransactionReceiptResponse).revert_reason || 'Transaction Reverted'),
          duration: 20_000,
          isError: true
        })
        throw Error((receipt as RevertedTransactionReceiptResponse).revert_reason || 'Transaction Reverted')
      }

      const events = getEvents(receipt);
      const parsedEvents = parseAllEvents(receipt);

      //torii too slow indexing...
      await sleep(1_000);

      setIsPending(false)

      return {
        hash: tx?.transaction_hash,
        receipt,
        events,
        parsedEvents,
      };


    },
    [dojoProvider, account, toast],
  );

  const createGame = useCallback(
    async (gameMode: GameMode, playerName: string, avatarId: number) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::game::game",
        "create_game",
        [gameMode, avatarId],
      );

      const gameCreated = parsedEvents.find(
        (e) => e.eventType === WorldEvents.GameCreated,
      ) as GameCreatedEventData;

      return {
        hash,
        gameId: gameCreated.gameId,
      };
    },
    [executeAndReceipt],
  );

  const travel = useCallback(
    async (gameId: string, location: Location) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::game::game",
        "travel",
        [gameId, location],
      );

      const isGameOver = parsedEvents
        .find((e) => e.eventType === WorldEvents.GameOver)

      const adverseEvent = parsedEvents.find(
        (e) => e.eventType === WorldEvents.AdverseEvent,
      ) as AdverseEventData

      const atPawnshopEvent = parsedEvents.find(
        (e) => e.eventType === WorldEvents.AtPawnshop,
      ) as AtPawnshopEventData

      return {
        hash,
        isGameOver,
        event: adverseEvent || atPawnshopEvent,
        events: parsedEvents
          .filter((e) => e.eventType === WorldEvents.HighVolatility)
          .map((e) => e as HighVolatilityData),
      };
    },
    [executeAndReceipt],
  );

  const trade = useCallback(
    async (gameId: string, trades: Array<Trade>) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::game::game",
        "trade",
        [gameId, trades],
      );

      return {
        hash,
        events: []
      };
    },
    [executeAndReceipt],
  );

  const shop = useCallback(
    async (gameId: string, actions: Array<ShopAction>) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::game::game",
        "shop",
        [gameId, actions],
      );

      return {
        hash,
        events: []
      }
    },
    [executeAndReceipt],
  );


  const endGame = useCallback(
    async (gameId: string) => {
      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::game::game",
        "end_game",
        [gameId],
      );

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );



  const decide = useCallback(
    async (gameId: string, action: Action) => {
      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::decide::decide",
        "decide",
        [gameId, action],
      );

      const isGameOver = parsedEvents
        .find((e) => e.eventType === WorldEvents.GameOver)

      const consequenceEvent = parsedEvents.find(
        (e) => e.eventType === WorldEvents.Consequence,
      ) as ConsequenceEventData

      return {
        hash,
        isGameOver,
        event: parsedEvents.find(
          (e) => e.eventType === WorldEvents.Consequence,
        ) as ConsequenceEventData,
        events: parsedEvents
          .filter((e) => e.eventType === WorldEvents.HighVolatility)
          .map((e) => e as HighVolatilityData),
      };
    },
    [executeAndReceipt],
  );

  const buyItem = useCallback(
    async (gameId: string, itemId: number) => {
      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::shop::shop",
        "buy_item",
        [gameId, itemId],
      );

      return {
        hash,
        events: parsedEvents
          .filter((e) => e.eventType === WorldEvents.HighVolatility)
          .map((e) => e as HighVolatilityData),
      };
    },
    [executeAndReceipt],
  );

  const skipShop = useCallback(
    async (gameId: string) => {
      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::shop::shop",
        "skip",
        [gameId],
      );

      return {
        hash,
        events: parsedEvents
          .filter((e) => e.eventType === WorldEvents.HighVolatility)
          .map((e) => e as HighVolatilityData),
      };
    },
    [executeAndReceipt],
  );


  const failingTx = useCallback(
    async () => {
      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::devtools::devtools",
        "failing_tx",
        [],
      );

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );


  // const setName = useCallback(
  //   async (gameId: string, playerName: string) => {
  //     const { hash,  events, parsedEvents } = await executeAndReceipt(
  //       "lobby",
  //       "set_name",
  //       [gameId, shortString.encodeShortString(playerName)],
  //     );

  //     return {
  //       hash,
  //     };
  //   },
  //   [executeAndReceipt],
  // );


  return {
    createGame,
    travel,
    trade,
    endGame,
    shop,
    // buy,
    // sell,
    //setName,
    decide,
    buyItem,
    skipShop,

    // devtool
    failingTx,

    error,
    isPending,
  };
};
