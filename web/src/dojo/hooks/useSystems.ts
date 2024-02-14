import { useToast } from "@/hooks/toast";
import { getEvents } from "@dojoengine/utils";
import { useCallback, useState } from "react";
import { BigNumberish, GetTransactionReceiptResponse } from "starknet";
import { PendingCallWithCost, pendingCallToCairoEnum } from "../class/Game";
import { BaseEventData, GameCreatedData, HighVolatilityData, TravelEncounterData, parseAllEvents } from "../events";
import { TravelEncounterResultData, WorldEvents } from "../generated/contractEvents";
import { EncountersAction, GameMode, Locations } from "../types";
import { useDojoContext } from "./useDojoContext";

export interface SystemsInterface {
  createGame: (gameMode: number, hustlerId: number, playerName: string) => Promise<SystemExecuteResult>;
  travel: (gameId: string, locationId: Locations, actions: Array<PendingCallWithCost>, playerName: string) => Promise<SystemExecuteResult>;
  endGame: (gameId: string, playerName: string) => Promise<SystemExecuteResult>;
  decide: (gameId: string, action: EncountersAction, playerName: string) => Promise<SystemExecuteResult>;

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

  const { toast, clear: clearToasts } = useToast();

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
        toast({
          message: `tx sent ${tx.transaction_hash.substring(0, 4)}...${tx.transaction_hash.slice(-4)}`,
          duration: 5_000,
          isError: false
        })

        //
        // TODO : remove later
        //
        await sleep(1_500);
        clearToasts()

        receipt = await account!.waitForTransaction(tx.transaction_hash, {
          retryInterval: 200,
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

      // if (receipt.execution_status === "REJECTED") {
      //   setError("Transaction Rejected")
      //   setIsPending(false)
      //   toast({
      //     message: tryBetterErrorMsg((receipt as RejectedTransactionReceiptResponse).transaction_failure_reason.error_message),
      //     duration: 20_000,
      //     isError: true
      //   })
      //   throw Error((receipt as RejectedTransactionReceiptResponse).transaction_failure_reason.error_message)
      // }

      if (receipt.execution_status === "REVERTED") {
        setError("Transaction Reverted")
        setIsPending(false)

        toast({
          message: tryBetterErrorMsg(receipt.revert_reason || 'Transaction Reverted'),
          duration: 20_000,
          isError: true
        })
        throw Error(receipt.revert_reason || 'Transaction Reverted')
      }

      const events = getEvents(receipt);
      const parsedEvents = parseAllEvents(receipt);


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
    async (gameMode: GameMode, hustlerId: number, playerName: string,) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::game::game",
        "create_game",
        [gameMode, hustlerId, playerName],
      );

      const gameCreated = parsedEvents.find(
        (e) => e.eventType === WorldEvents.GameCreated,
      ) as GameCreatedData;

      return {
        hash,
        gameId: gameCreated.gameId,
      };
    },
    [executeAndReceipt],
  );

  const travel = useCallback(
    async (gameId: string, location: Locations, calls: Array<PendingCallWithCost>, playerName: string) => {

      const callsEnum = calls.map(pendingCallToCairoEnum)
      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::game::game",
        "travel",
        // @ts-ignore
        [gameId, location, callsEnum, playerName],
      );

      const isGameOver = parsedEvents
        .find((e) => e.eventType === WorldEvents.GameOver)

      const travelEncounter = parsedEvents.find(
        (e) => e.eventType === WorldEvents.TravelEncounter,
      ) as TravelEncounterData


      return {
        hash,
        isGameOver,
        event: travelEncounter,
        events: parsedEvents
          .filter((e) => e.eventType === WorldEvents.HighVolatility)
          .map((e) => e as HighVolatilityData),
      };
    },
    [executeAndReceipt],
  );


  const endGame = useCallback(
    async (gameId: string, calls: Array<PendingCallWithCost>, playerName: string) => {
      const callsEnum = calls.map(pendingCallToCairoEnum)

      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::game::game",
        "end_game",
        // @ts-ignore
        [gameId, callsEnum, playerName],
      );

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );


  const decide = useCallback(
    async (gameId: string, action: EncountersAction, playerName: string) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        "rollyourown::systems::game::game",
        "decide",
        [gameId, action, playerName],
      );

      const isGameOver = parsedEvents
        .find((e) => e.eventType === WorldEvents.GameOver)

      const travelEncounterResult = parsedEvents.find(
        (e) => e.eventType === WorldEvents.TravelEncounterResult,
      ) as TravelEncounterResultData

      return {
        hash,
        isGameOver,
        event: travelEncounterResult,
        events: parsedEvents
          .filter((e) => e.eventType === WorldEvents.HighVolatility)
          .map((e) => e as HighVolatilityData),
      };


    },
    [executeAndReceipt],
  );


  //
  //
  //


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




  return {
    createGame,
    travel,
    endGame,
    decide,
    //
    failingTx,
    //
    error,
    isPending,
  };
};
