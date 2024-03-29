import { useToast } from "@/hooks/toast";
import { getEvents } from "@dojoengine/utils";
import { useAccount } from "@starknet-react/core";
import { useCallback, useState } from "react";
import {
  BigNumberish, Call,
  GetTransactionReceiptResponse,
  shortString, uint256
} from "starknet";
import { PendingCall, pendingCallToCairoEnum } from "../class/Game";
import { BaseEventData, GameCreatedData, HighVolatilityData, TravelEncounterData, TravelEncounterResultData, parseAllEvents } from "../events";
import { WorldEvents } from "../generated/contractEvents";
import { EncountersAction, GameMode, Locations } from "../types";
import { useConfigStore } from "./useConfigStore";
import { useDojoContext } from "./useDojoContext";

export interface SystemsInterface {
  createGame: (gameMode: number, hustlerId: number, playerName: string) => Promise<SystemExecuteResult>;
  travel: (gameId: string, locationId: Locations, actions: Array<PendingCall>) => Promise<SystemExecuteResult>;
  endGame: (gameId: string, actions: Array<PendingCall>) => Promise<SystemExecuteResult>;
  decide: (gameId: string, action: EncountersAction) => Promise<SystemExecuteResult>;
  claim: (season: number) => Promise<SystemExecuteResult>;
  //
  setPaused: (paused: boolean) => Promise<SystemExecuteResult>;
  claimTreasury: () => Promise<SystemExecuteResult>;
  setPaperFee: (fee: number) => Promise<SystemExecuteResult>;
  setTreasuryFeePct: (fee: number) => Promise<SystemExecuteResult>;
  //
  failingTx: () => Promise<SystemExecuteResult>;
  feedLeaderboard: (count: number) => Promise<SystemExecuteResult>;

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

export type DojoCall = {
  contractName: string;
  functionName: string;
  callData: BigNumberish[];
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
    clients: { dojoProvider },
    configStore,
  } = useDojoContext();

  const { account } = useAccount()
  const { config } = useConfigStore();

  const { toast, clear: clearToasts } = useToast();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);


  const executeAndReceipt = useCallback(
    async (params: DojoCall | Call[]): Promise<{
      hash: string;
      receipt: GetTransactionReceiptResponse;
      events: any[];
      parsedEvents: any[];
    }> => {

      if (!account) {
        toast({
          message: `not connected`,
          duration: 5_000,
          isError: true
        })
        // throw Error(`not connected`)
        // return {
        //   hash:""
        // }
      }

      setError(undefined)
      setIsPending(true)

      let tx, receipt;
      try {

        if (!Array.isArray(params)) {
          tx = await dojoProvider.execute(account!, params.contractName, params.functionName, params.callData);
        } else {
          tx = await dojoProvider.executeMulti(account!, params)
        }

        toast({
          message: `tx sent ${tx.transaction_hash.substring(0, 4)}...${tx.transaction_hash.slice(-4)}`,
          duration: 5_000,
          isError: false
        })

        //
        // TODO : remove later
        //
        await sleep(1_000);
        // clearToasts()

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

      if (receipt) {
        let receipt_error = undefined
        // if ("status" in receipt && receipt.status === "REJECTED") {
        //   receipt_error = {
        //     status: "REJECTED",
        //     message: (receipt as RejectedTransactionReceiptResponse).transaction_failure_reason.error_message
        //   }
        // }

        if ("execution_status" in receipt && receipt.execution_status === "REVERTED") {
          receipt_error = {
            status: "REVERTED",
            message: receipt.revert_reason || "REVERTED"
          }
        }

        if (receipt_error) {
          setError(`Transaction ${receipt_error.status}`)

          toast({
            message: tryBetterErrorMsg(receipt_error.message || ""),
            duration: 20_000,
            isError: true
          })
        }
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

      const paperFee = config?.ryo.paper_fee * 10 ** 18;
      const paperAddress = config?.ryoAddress.paper;
      const gameAddress = dojoProvider.manifest.contracts.find((i: any) => i.name === "rollyourown::systems::game::game").address;
      // 
      const approvalCall: Call = {
        contractAddress: paperAddress,
        entrypoint: "approve",
        calldata: [gameAddress, uint256.bnToUint256(paperFee)]
      }

      const createGameCall = {
        contractAddress: gameAddress,
        entrypoint: "create_game",
        calldata: [gameMode, hustlerId, shortString.encodeShortString(playerName)]
      }

      const { hash, events, parsedEvents } = await executeAndReceipt([approvalCall, createGameCall]);

      const gameCreated = parsedEvents.find(
        (e) => e.eventType === WorldEvents.GameCreated,
      ) as GameCreatedData;

      return {
        hash,
        gameId: gameCreated.gameId,
      };
    },
    [executeAndReceipt, config?.ryoAddress.paper],
  );



  const travel = useCallback(
    async (gameId: string, location: Locations, calls: Array<PendingCall>) => {

      const callsEnum = calls.map(pendingCallToCairoEnum)
      const { hash, events, parsedEvents } = await executeAndReceipt(
        {
          contractName: "rollyourown::systems::game::game",
          functionName: "travel",
          // @ts-ignore
          callData: [gameId, location, callsEnum],
        }
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
    async (gameId: string, calls: Array<PendingCall>) => {
      const callsEnum = calls.map(pendingCallToCairoEnum)

      const { hash, events, parsedEvents } = await executeAndReceipt(
        {
          contractName: "rollyourown::systems::game::game",
          functionName: "end_game",
          // @ts-ignore
          callData: [gameId, callsEnum],
        }
      );

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );


  const decide = useCallback(
    async (gameId: string, action: EncountersAction) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        {
          contractName: "rollyourown::systems::game::game",
          functionName: "decide",
          callData: [gameId, action],
        }
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

  const claim = useCallback(
    async (season: number) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        {
          contractName: "rollyourown::systems::game::game",
          functionName: "claim",
          callData: [season],
        }
      );

      return {
        hash,
      };

    },
    [executeAndReceipt],
  );



  //
  //
  //


  const claimTreasury = useCallback(
    async () => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        {
          contractName: "rollyourown::systems::game::game",
          functionName: "claim_treasury",
          callData: [],
        }
      );

      return {
        hash,
      };

    },
    [executeAndReceipt],
  );



  const setPaused = useCallback(
    async (paused: boolean) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        {
          contractName: "rollyourown::systems::ryo::ryo",
          functionName: "set_paused",
          callData: [paused ? 0 : 1],
        }
      );

      return {
        hash,
      };

    },
    [executeAndReceipt],
  );


  const setPaperFee = useCallback(
    async (paperFee: number) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        {
          contractName: "rollyourown::systems::ryo::ryo",
          functionName: "set_paper_fee",
          callData: [paperFee],
        }
      );

      return {
        hash,
      };

    },
    [executeAndReceipt],
  );

  const setTreasuryFeePct = useCallback(
    async (treasuryFeePct: number) => {

      const { hash, events, parsedEvents } = await executeAndReceipt(
        {
          contractName: "rollyourown::systems::ryo::ryo",
          functionName: "set_treasury_fee_pct",
          callData: [treasuryFeePct],
        }
      );

      return {
        hash,
      };

    },
    [executeAndReceipt],
  );






  //
  //
  //


  const feedLeaderboard = useCallback(
    async (count: number) => {
      const { hash, events, parsedEvents } = await executeAndReceipt(
        {
          contractName: "rollyourown::systems::devtools::devtools",
          functionName: "feed_leaderboard",
          callData: [count],
        }
      );

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );


  const failingTx = useCallback(
    async () => {
      const { hash, events, parsedEvents } = await executeAndReceipt(
        {
          contractName: "rollyourown::systems::devtools::devtools",
          functionName: "failing_tx",
          callData: [],
        }
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
    claim,
    claimTreasury,
    //
    setPaused,
    setPaperFee,
    setTreasuryFeePct,
    //
    feedLeaderboard,
    failingTx,
    //
    error,
    isPending,
  };
};
