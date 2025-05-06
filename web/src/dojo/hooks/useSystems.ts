import { Dopewars_DrugConfig as DrugConfig, Dopewars_RyoConfig as RyoConfig } from "@/generated/graphql";
import { useToast } from "@/hooks/toast";
import { useAccount } from "@starknet-react/core";
import { useCallback, useMemo, useState } from "react";
import { AllowArray, Call, CallData, GetTransactionReceiptResponse, shortString, uint256 } from "starknet";
import { PendingCall, pendingCallToCairoEnum } from "../class/Game";
import { EncountersAction, GameMode, Locations } from "../types";
import { useConfigStore } from "./useConfigStore";
import { useDojoContext } from "./useDojoContext";
import { DojoCall, getContractByName } from "@dojoengine/core";
import { buildVrfCalls, sleep } from "../utils";
import { useDopeStore } from "@dope/dope-sdk/store";
import { parseModels } from "@dope/dope-sdk";

export const ETHER = 10n ** 18n;
export const DW_NS = "dopewars";

interface SystemsInterface {
  createGame: (
    gameMode: number,
    hustlerId: number,
    playerName: string,
    tokenIdType: number,
    tokenId: number,
  ) => Promise<SystemExecuteResult>;
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
  // slot
  rollSlot: (gameId: number) => Promise<SystemExecuteResult>;
  // dev
  failingTx: () => Promise<SystemExecuteResult>;
  createFakeGame: (finalScore: number) => Promise<SystemExecuteResult>;
  createNewSeason: () => Promise<SystemExecuteResult>;

  isPending: boolean;
  error?: string;
}

interface SystemExecuteResult {
  hash: string;
  receipt?: GetTransactionReceiptResponse;
  [key: string]: any;
}

interface ExecuteAndReceiptResult extends SystemExecuteResult {}

const tryBetterErrorMsg = (msg: string): string => {
  const failureReasonIndex = msg.indexOf("Failure reason");
  if (failureReasonIndex > 0) {
    let betterMsg = msg.substring(failureReasonIndex);
    const cairoTracebackIndex = betterMsg.indexOf('\\n","transaction_index');
    if (cairoTracebackIndex > -1) {
      betterMsg = betterMsg.substring(0, cairoTracebackIndex);
    }
    return betterMsg;
  }

  return msg;
};

export const useSystems = (): SystemsInterface => {
  const {
    clients: { dojoProvider, rpcProvider, toriiClient },
    chains: { selectedChain },
  } = useDojoContext();

  const { account } = useAccount();
  const { config } = useConfigStore();

  const { toast } = useToast();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const { gameAddress, laundromatAddress, dopeLootClaimAddress } = useMemo(() => {
    const gameAddress = getContractByName(dojoProvider.manifest, DW_NS, "game").address;
    const laundromatAddress = getContractByName(dojoProvider.manifest, DW_NS, "laundromat").address;
    const dopeLootClaimAddress = getContractByName(dojoProvider.manifest, "dojo", "DopeLootClaim").address;

    return { gameAddress, laundromatAddress, dopeLootClaimAddress };
  }, [dojoProvider]);

  const dopeLootClaimState = useDopeStore((state) => state.dopeLootClaimState);

  const executeAndReceipt = useCallback(
    async (calls: AllowArray<DojoCall | Call>): Promise<ExecuteAndReceiptResult> => {
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
        ///@ts-ignore
        tx = await dojoProvider.execute(account!, calls, DW_NS);

        receipt = await rpcProvider.waitForTransaction(tx.transaction_hash, {
          retryInterval: 200,
        });
      } catch (e: any) {
        setIsPending(false);
        //setError(e.toString());
        toast({
          message: e ? tryBetterErrorMsg(e.toString()) : "unknown error",
          duration: 10_000,
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
            duration: 10_000,
            isError: true,
          });
        }
      }

      setIsPending(false);

      return {
        hash: tx?.transaction_hash || "",
        receipt,
      };
    },
    [rpcProvider, dojoProvider, account, selectedChain, toast],
  );

  const createGame = useCallback(
    async (gameMode: GameMode, hustlerId: number, playerName: string, tokenIdType: number, tokenId: number) => {
      const paperFee = BigInt(config?.ryo.paper_fee) * ETHER;
      const paperAddress = selectedChain.paperAddress;

      //
      const approvalCall: Call = {
        contractAddress: paperAddress,
        entrypoint: "approve",
        calldata: CallData.compile({ gameAddress, amount: uint256.bnToUint256(paperFee) }),
      };

      const createGameCall = {
        contractAddress: gameAddress,
        entrypoint: "create_game",
        calldata: CallData.compile([
          gameMode,
          hustlerId,
          shortString.encodeShortString(playerName),
          tokenIdType,
          tokenId,
        ]),
      };

      const createGameCalls = await buildVrfCalls({
        account: account!,
        call: createGameCall,
        vrfProviderAddress: selectedChain.vrfProviderAddress,
        vrfProviderSecret: selectedChain.vrfProviderSecret,
      });

      const calls =
        createGameCalls.length === 2
          ? [createGameCalls[0], approvalCall, createGameCalls[1]]
          : [approvalCall, ...createGameCalls];
      // console.log(calls);

      const { hash } = await executeAndReceipt(calls);

      return {
        hash,
      };
    },
    [executeAndReceipt, config?.ryoAddress.paper, selectedChain],
  );

  const endGame = useCallback(
    async (gameId: string, calls: Array<PendingCall>) => {
      const callsEnum = calls.map(pendingCallToCairoEnum);

      const { hash } = await executeAndReceipt({
        contractAddress: gameAddress,
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
    async (gameId: string, location: Locations, pending_calls: Array<PendingCall>) => {
      const callsEnum = pending_calls.map(pendingCallToCairoEnum);

      const call = {
        contractAddress: gameAddress,
        entrypoint: "travel",
        // @ts-ignore
        calldata: CallData.compile({ gameId, location, callsEnum }),
      };

      const calls = await buildVrfCalls({
        account: account!,
        call,
        vrfProviderAddress: selectedChain.vrfProviderAddress,
        vrfProviderSecret: selectedChain.vrfProviderSecret,
      });

      const { hash } = await executeAndReceipt(calls);

      return {
        hash,
      };
    },
    [executeAndReceipt, selectedChain],
  );

  const decide = useCallback(
    async (gameId: string, action: EncountersAction) => {
      const call = {
        contractAddress: gameAddress,
        entrypoint: "decide",
        calldata: CallData.compile([gameId, action]),
      };

      const calls = await buildVrfCalls({
        account: account!,
        call,
        vrfProviderAddress: selectedChain.vrfProviderAddress,
        vrfProviderSecret: selectedChain.vrfProviderSecret,
      });

      const { hash } = await executeAndReceipt(calls);

      return {
        hash,
      };
    },
    [executeAndReceipt, selectedChain],
  );

  //
  // LAUNDROMAT
  //

  const registerScore = useCallback(
    async (gameId: string, prevGameId: string, prevPlayerId: string) => {
      const calls = [
        {
          contractName: `laundromat`,
          entrypoint: "register_score",
          // @ts-ignore
          calldata: CallData.compile([gameId, prevGameId, prevPlayerId]),
        },
      ];

      const playerId = account?.address;
      const gameWithTokenIdEntities = await toriiClient.getEntities({
        clause: {
          Keys: {
            keys: [Number(gameId).toString(), playerId],
            models: ["dopewars-GameWithTokenId"],
            pattern_matching: "FixedLen",
          },
        },
        pagination: {
          limit: 1,
          cursor: undefined,
          direction: "Forward",
          order_by: [],
        },
        no_hashed_keys: true,
        models: ["dopewars-GameWithTokenId"],
        historical: false,
      });

      if (Object.keys(gameWithTokenIdEntities).length > 0) {
        // retrieve loot_id used with game_id
        const gameWithTokenId = parseModels(gameWithTokenIdEntities, "dopewars-GameWithTokenId")[0];

        let lootId = 0;
        // @ts-ignore
        if (gameWithTokenId.token_id.activeVariant() === "LootId") {
          // @ts-ignore
          lootId = Number(gameWithTokenId.token_id.unwrap());
        }

        if (lootId > 0) {
          const isReleased = dopeLootClaimState[lootId]?.isReleased;
          if (!isReleased) {
            const lootIdU256 = uint256.bnToUint256(lootId);

            calls.push({
              //@ts-ignore
              contractAddress: dopeLootClaimAddress,
              entrypoint: "release",
              // @ts-ignore
              calldata: CallData.compile([lootIdU256.low, lootIdU256.high, gameId]),
            });
          }
        }
      }

      // console.log(calls);

      const { hash } = await executeAndReceipt(calls);

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const claim = useCallback(
    async (playerId: string, gameIds: number[]) => {
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: `laundromat`,
        entrypoint: "claim",
        calldata: [playerId, gameIds],
        // calldata: CallData.compile([playerId, gameIds]),
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const claimTreasury = useCallback(async () => {
    const { hash, events, parsedEvents } = await executeAndReceipt({
      contractName: `laundromat`,
      entrypoint: "claim_treasury",
      calldata: [],
    });

    return {
      hash,
    };
  }, [executeAndReceipt]);

  const superchargeJackpot = useCallback(
    async (season: number, amountEth: number) => {
      const paperAddress = selectedChain.paperAddress;
      const amount = BigInt(amountEth) * ETHER;

      //
      const approvalCall: Call = {
        contractAddress: paperAddress,
        entrypoint: "approve",
        calldata: CallData.compile({ laundromatAddress, amount: uint256.bnToUint256(amount) }),
      };

      const superchargeJackpotCall = {
        contractName: `laundromat`,
        entrypoint: "supercharge_jackpot",
        calldata: CallData.compile([season, amountEth]),
      };

      const { hash } = await executeAndReceipt([approvalCall, superchargeJackpotCall]);

      return {
        hash,
      };
    },
    [executeAndReceipt, config],
  );

  const launder = useCallback(
    async (season: number) => {
      const call = {
        contractAddress: laundromatAddress,
        entrypoint: "launder",
        calldata: CallData.compile([season]),
      };

      const calls = await buildVrfCalls({
        account: account!,
        call,
        vrfProviderAddress: selectedChain.vrfProviderAddress,
        vrfProviderSecret: selectedChain.vrfProviderSecret,
      });
      const { hash } = await executeAndReceipt(calls);

      return {
        hash,
      };
    },
    [executeAndReceipt, selectedChain],
  );

  //
  //
  //

  const setPaused = useCallback(
    async (paused: boolean) => {
      const { hash } = await executeAndReceipt({
        contractName: `ryo`,
        entrypoint: "set_paused",
        calldata: [paused ? 1 : 0],
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const updateRyoConfig = useCallback(
    async (ryoConfig: RyoConfig) => {
      const { hash } = await executeAndReceipt({
        contractName: `ryo`,
        entrypoint: "update_ryo_config",
        calldata: CallData.compile({
          key: 0, // ignored in contract
          initialized: 1, // ignored in contract
          paused: 0, // ignored in contract
          season_version: 0, // ignored in contract
          season_duration: ryoConfig.season_duration,
          season_time_limit: ryoConfig.season_time_limit,
          paper_fee: ryoConfig.paper_fee,
          paper_reward_launderer: ryoConfig.paper_reward_launderer,
          treasury_fee_pct: ryoConfig.treasury_fee_pct,
          treasury_balance: 0, // ignored in contract
        }),
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const updateDrugConfig = useCallback(
    async (drugConfig: DrugConfig) => {
      const { hash } = await executeAndReceipt({
        contractName: `config`,
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

  const rollSlot = useCallback(
    async (gameId: number) => {
      const slotMachineAddress = dojoProvider.manifest.contracts.find(
        (i: any) => i.tag === `${DW_NS}-slotmachine`,
      ).address;

      const call = {
        contractAddress: slotMachineAddress,
        entrypoint: "roll",
        calldata: [gameId],
      };
      const calls = await buildVrfCalls({
        account: account!,
        call,
        vrfProviderAddress: selectedChain.vrfProviderAddress,
        vrfProviderSecret: selectedChain.vrfProviderSecret,
      });

      const { hash } = await executeAndReceipt(calls);

      return {
        hash,
      };
    },
    [executeAndReceipt, selectedChain],
  );

  //
  //
  //

  const createFakeGame = useCallback(
    async (finalScore = 0) => {
      const { hash } = await executeAndReceipt({
        contractName: `devtools`,
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
      const { hash } = await executeAndReceipt({
        contractName: `devtools`,
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
    const { hash } = await executeAndReceipt({
      contractName: `devtools`,
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
    rollSlot,
    //
    failingTx,
    createFakeGame,
    createNewSeason,
    //
    error,
    isPending,
  };
};
