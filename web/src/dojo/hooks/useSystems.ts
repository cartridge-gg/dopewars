import { DrugConfig, RyoConfig } from "@/generated/graphql";
import { useToast } from "@/hooks/toast";
import { getEvents } from "@dojoengine/utils";
import { useAccount } from "@starknet-react/core";
import { useCallback, useState } from "react";
import { AllowArray, Call, CallData, GetTransactionReceiptResponse, shortString, uint256 } from "starknet";
import { PendingCall, pendingCallToCairoEnum } from "../class/Game";
import {
  BaseEventData,
  GameCreatedData,
  HighVolatilityData,
  TravelEncounterData,
  TravelEncounterResultData,
  parseAllEvents,
} from "../events";
import { WorldEvents } from "../generated/contractEvents";
import { EncountersAction, GameMode, Locations } from "../types";
import { useConfigStore } from "./useConfigStore";
import { useDojoContext } from "./useDojoContext";
import { DojoCall } from "@dojoengine/core";
import { sleep } from "../utils";

export const ETHER = 10n ** 18n;

export interface SystemsInterface {
  createGame: (gameMode: number, hustlerId: number, playerName: string) => Promise<SystemExecuteResult>;
  endGame: (gameId: string, actions: Array<PendingCall>) => Promise<SystemExecuteResult>;
  travel: (gameId: string, locationId: Locations, actions: Array<PendingCall>) => Promise<SystemExecuteResult>;
  decide: (gameId: string, action: EncountersAction) => Promise<SystemExecuteResult>;
  // ryo
  setPaused: (paused: boolean) => Promise<SystemExecuteResult>;
  updateRyoConfig: (ryoConfig: RyoConfig) => Promise<SystemExecuteResult>;
  
  // config
  updateDrugConfig: (drugConfig: DrugConfig) => Promise<SystemExecuteResult>;
  
  // laundromat
  registerScore: (gameId: string, prevGameId: string, prevPlayerId: string) => Promise<SystemExecuteResult>;
  claim: (playerId: string, gameIds: number[]) => Promise<SystemExecuteResult>;
  launder: (season: number) => Promise<SystemExecuteResult>;
  claimTreasury: () => Promise<SystemExecuteResult>;
  superchargeJackpot: (season: number, amount_eth: number) => Promise<SystemExecuteResult>;
  // dev
  failingTx: () => Promise<SystemExecuteResult>;
  createFakeGame: (finalScore: number) => Promise<SystemExecuteResult>;
  createNewSeason: () => Promise<SystemExecuteResult>;

  isPending: boolean;
  error?: string;
}

export interface SystemExecuteResult {
  hash: string;
  receipt?: GetTransactionReceiptResponse;
  event?: BaseEventData;
  parsedEvents?: any[];
  isGameOver?: BaseEventData;
  [key: string]: any;
}

export interface ExecuteAndReceiptResult {
  hash: string;
  receipt?: GetTransactionReceiptResponse;
  event?: BaseEventData;
  parsedEvents: any[];
  isGameOver?: BaseEventData;
  [key: string]: any;
}

const tryBetterErrorMsg = (msg: string): string => {
  const failureReasonIndex = msg.indexOf("Failure reason");
  if (failureReasonIndex > 0) {
    let betterMsg = msg.substring(failureReasonIndex);
    const cairoTracebackIndex = betterMsg.indexOf("Cairo traceback");
    betterMsg = betterMsg.substring(0, cairoTracebackIndex);
    return betterMsg;
  }

  return msg;
};

export const useSystems = (): SystemsInterface => {
  const {
    clients: { dojoProvider, rpcProvider },
    chains: {
      selectedChain,
      selectedChain: { manifest },
    },
    configStore,
  } = useDojoContext();

  const { account } = useAccount();
  const { config } = useConfigStore();

  const { toast, clear: clearToasts } = useToast();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  //
  //
  //

  const executeAndReceipt = useCallback(
    async (params: AllowArray<DojoCall | Call>): Promise<ExecuteAndReceiptResult> => {
      if (!account) {
        toast({
          message: `not connected`,
          duration: 5_000,
          isError: true,
        });
      }

      // override wallet (ArgentX / Braavos) default providers..
      // @ts-ignore
      account.provider = rpcProvider;
      // @ts-ignore
      account.chainId = await rpcProvider.getChainId();

      setError(undefined);
      setIsPending(true);

      let tx, receipt;

      try {
        tx = await dojoProvider.execute(account!, params);

        // toast({
        //   message: `tx sent ${tx.transaction_hash.substring(0, 4)}...${tx.transaction_hash.slice(-4)}`,
        //   duration: 5_000,
        //   isError: false
        // })

        receipt = await account!.waitForTransaction(tx.transaction_hash, {
          retryInterval: 500,
        });

        // chill waiting torii indexing
        await sleep(1000);
      } catch (e: any) {
        setIsPending(false);
        setError(e.toString());
        toast({
          message: tryBetterErrorMsg(e.toString()),
          duration: 20_000,
          isError: true,
        });
        // throw Error(e.toString());
      }

      if (receipt) {
        let receipt_error = undefined;

        if ("execution_status" in receipt && receipt.execution_status === "REVERTED") {
          receipt_error = {
            status: "REVERTED",
            message: receipt.revert_reason || "REVERTED",
          };
        }

        if (receipt_error) {
          setError(`Transaction ${receipt_error.status}`);

          toast({
            message: tryBetterErrorMsg(receipt_error.message || ""),
            duration: 20_000,
            isError: true,
          });
        }
      }

      const events = receipt ? getEvents(receipt) : [];
      const parsedEvents = parseAllEvents(receipt);

      setIsPending(false);

      return {
        hash: tx?.transaction_hash || "",
        receipt,
        events,
        parsedEvents,
      };
    },
    [dojoProvider, account, toast],
  );

  const createGame = useCallback(
    async (gameMode: GameMode, hustlerId: number, playerName: string) => {
      const paperFee = BigInt(config?.ryo.paper_fee) * ETHER;
      const paperAddress = config?.ryoAddress.paper;
      const gameAddress = dojoProvider.manifest.contracts.find(
        (i: any) => i.name === "rollyourown::systems::game::game",
      ).address;

      //
      const approvalCall: Call = {
        contractAddress: paperAddress,
        entrypoint: "approve",
        calldata: CallData.compile({ gameAddress, amount: uint256.bnToUint256(paperFee) }),
      };

      const createGameCall = {
        contractName: "rollyourown::systems::game::game",
        //  contractAddress: gameAddress,
        entrypoint: "create_game",
        calldata: [gameMode, hustlerId, shortString.encodeShortString(playerName)],
      };

      const { hash, events, parsedEvents } = await executeAndReceipt([approvalCall, createGameCall]);

      const gameCreated = parsedEvents.find((e) => e.eventType === WorldEvents.GameCreated) as GameCreatedData;

      return {
        hash,
        parsedEvents,
        gameId: gameCreated.gameId,
      };
    },
    [executeAndReceipt, config?.ryoAddress.paper],
  );

  const endGame = useCallback(
    async (gameId: string, calls: Array<PendingCall>) => {
      const callsEnum = calls.map(pendingCallToCairoEnum);

      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: "rollyourown::systems::game::game",
        entrypoint: "end_game",
        // @ts-ignore
        calldata: CallData.compile({ gameId, callsEnum }),
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const travel = useCallback(
    async (gameId: string, location: Locations, calls: Array<PendingCall>) => {
      const callsEnum = calls.map(pendingCallToCairoEnum);
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: "rollyourown::systems::game::game",
        entrypoint: "travel",
        // @ts-ignore
        //  calldata: [gameId, location, callsEnum],
        calldata: CallData.compile({ gameId, location, callsEnum }),
      });

      const isGameOver = parsedEvents.find((e) => e.eventType === WorldEvents.GameOver);

      const travelEncounter = parsedEvents.find(
        (e) => e.eventType === WorldEvents.TravelEncounter,
      ) as TravelEncounterData;

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

  const decide = useCallback(
    async (gameId: string, action: EncountersAction) => {
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: "rollyourown::systems::game::game",
        entrypoint: "decide",
        calldata: [gameId, action],
      });

      const isGameOver = parsedEvents.find((e) => e.eventType === WorldEvents.GameOver);

      const travelEncounterResult = parsedEvents.find(
        (e) => e.eventType === WorldEvents.TravelEncounterResult,
      ) as TravelEncounterResultData;

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
  // LAUNDROMAT
  //

  const registerScore = useCallback(
    async (gameId: string, prevGameId: string, prevPlayerId: string) => {
      const { hash } = await executeAndReceipt({
        contractName: "rollyourown::systems::laundromat::laundromat",
        entrypoint: "register_score",
        // @ts-ignore
        calldata: [gameId, prevGameId, prevPlayerId],
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const claim = useCallback(
    async (playerId: string, gameIds: number[]) => {
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: "rollyourown::systems::laundromat::laundromat",
        entrypoint: "claim",
        calldata: [playerId, gameIds],
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const claimTreasury = useCallback(async () => {
    const { hash, events, parsedEvents } = await executeAndReceipt({
      contractName: "rollyourown::systems::laundromat::laundromat",
      entrypoint: "claim_treasury",
      calldata: [],
    });

    return {
      hash,
    };
  }, [executeAndReceipt]);

  const superchargeJackpot = useCallback(
    async (season: number, amountEth: number) => {
      const paperAddress = config?.ryoAddress.paper;
      const laundromatAddress = dojoProvider.manifest.contracts.find(
        (i: any) => i.name === "rollyourown::systems::laundromat::laundromat",
      ).address;

      const amount = BigInt(amountEth) * ETHER;

      //
      const approvalCall: Call = {
        contractAddress: paperAddress,
        entrypoint: "approve",
        calldata: CallData.compile({ laundromatAddress, amount: uint256.bnToUint256(amount) }),
      };

      const superchargeJackpotCall = {
        contractName: "rollyourown::systems::laundromat::laundromat",
        //  contractAddress: gameAddress,
        entrypoint: "supercharge_jackpot",
        calldata: [season, amountEth],
      };

      const { hash } = await executeAndReceipt([approvalCall, superchargeJackpotCall]);

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const launder = useCallback(
    async (season: number) => {
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: "rollyourown::systems::laundromat::laundromat",
        entrypoint: "launder",
        calldata: [season],
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  //
  //
  //

  const setPaused = useCallback(
    async (paused: boolean) => {
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: "rollyourown::systems::ryo::ryo",
        entrypoint: "set_paused",
        calldata: [paused ? 0 : 1],
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  
  const updateRyoConfig = useCallback(
    async (ryoConfig: RyoConfig) => {
      
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: "rollyourown::systems::ryo::ryo",
        entrypoint: "update_ryo_config",
        calldata: [ryoConfig],
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );



  const updateDrugConfig = useCallback(
    async (drugConfig: DrugConfig) => {
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: "rollyourown::config::config::config",
        entrypoint: "update_drug_config",
        calldata: [drugConfig],
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  //
  //
  //



  //
  //
  //

  const createFakeGame = useCallback(
    async (finalScore = 0) => {
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: "rollyourown::systems::devtools::devtools",
        entrypoint: "create_fake_game",
        calldata: [finalScore],
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const createNewSeason = useCallback(
    async (finalScore = 0) => {
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: "rollyourown::systems::devtools::devtools",
        entrypoint: "create_new_season",
        calldata: [],
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const failingTx = useCallback(async () => {
    const { hash, events, parsedEvents } = await executeAndReceipt({
      contractName: "rollyourown::systems::devtools::devtools",
      entrypoint: "failing_tx",
      calldata: [],
    });

    return {
      hash,
    };
  }, [executeAndReceipt]);

  return {
    createGame,
    endGame,
    travel,
    decide,
    //
    registerScore,
    claim,
    claimTreasury,
    superchargeJackpot,
    launder,
    //
    setPaused,
    updateRyoConfig,
    //
    updateDrugConfig,
    //
    failingTx,
    createFakeGame,
    createNewSeason,
    //
    error,
    isPending,
  };
};
