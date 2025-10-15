import { Dopewars_DrugConfig as DrugConfig, Dopewars_RyoConfig as RyoConfig } from "@/generated/graphql";
import { useToast } from "@/hooks/toast";
import { useAccount } from "@starknet-react/core";
import { useCallback, useMemo, useState } from "react";
import { AllowArray, Call, CallData, GetTransactionReceiptResponse, shortString, uint256, CairoOption, CairoOptionVariant } from "starknet";
import { PendingCall, pendingCallToCairoEnum } from "../class/Game";
import { EncountersAction, GameMode, Locations } from "../types";
import { useConfigStore } from "./useConfigStore";
import { useDojoContext } from "./useDojoContext";
import { DojoCall, getContractByName } from "@dojoengine/core";
import { sleep } from "../utils";
import { buildRandomnessCalls } from "../utils/randomness";
import { useDopeStore } from "@/dope/store";
import { parseModels } from "@/dope/toriiUtils";

export const ETHER = 10n ** 18n;
export const DW_NS = "dopewars";

interface SystemsInterface {
  mintGameToken: (playerName: string) => Promise<SystemExecuteResult & { tokenId?: number }>;
  createGame: (
    gameMode: number,
    playerName: string,
    multiplier: number,
    tokenIdType: number,
    tokenId: number,
    minigameTokenId: number,
  ) => Promise<SystemExecuteResult>;
  endGame: (tokenId: string, actions: Array<PendingCall>) => Promise<SystemExecuteResult>;
  travel: (tokenId: string, locationId: Locations, actions: Array<PendingCall>) => Promise<SystemExecuteResult>;
  decide: (tokenId: string, action: EncountersAction) => Promise<SystemExecuteResult>;
  // ryo
  setPaused: (paused: boolean) => Promise<SystemExecuteResult>;
  updateRyoConfig: (ryoConfig: RyoConfig) => Promise<SystemExecuteResult>;

  // config
  updateDrugConfig: (drugConfig: DrugConfig) => Promise<SystemExecuteResult>;

  // laundromat
  registerScore: (tokenId: string, prevGameId: string, prevPlayerId: string) => Promise<SystemExecuteResult>;
  claim: (playerId: string, tokenIds: number[]) => Promise<SystemExecuteResult>;
  launder: (season: number) => Promise<SystemExecuteResult>;
  claimTreasury: () => Promise<SystemExecuteResult>;
  superchargeJackpot: (season: number, amount_eth: number) => Promise<SystemExecuteResult>;
  // slot
  rollSlot: (tokenId: number) => Promise<SystemExecuteResult>;
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

export const tryBetterErrorMsg = (msg: string): string => {
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

  const { gameAddress, decideAddress, laundromatAddress, dopeLootClaimAddress, gameTokenAddress } = useMemo(() => {
    const gameAddress = getContractByName(dojoProvider.manifest, DW_NS, "game").address;
    const decideAddress = getContractByName(dojoProvider.manifest, DW_NS, "decide").address;
    const laundromatAddress = getContractByName(dojoProvider.manifest, DW_NS, "laundromat").address;
    const dopeLootClaimAddress = getContractByName(dojoProvider.manifest, "dope", "DopeLootClaim").address;
    const gameTokenAddress = getContractByName(dojoProvider.manifest, DW_NS, "game_token").address;

    return { gameAddress, decideAddress, laundromatAddress, dopeLootClaimAddress, gameTokenAddress };
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

  const mintGameToken = useCallback(
    async (playerName: string) => {
      if (!account) {
        toast({
          message: `not connected`,
          duration: 5_000,
          isError: true,
        });
        throw new Error("Account not connected");
      }

      // @ts-ignore
      account.provider = rpcProvider;
      // @ts-ignore
      account.chainId = await rpcProvider.getChainId();

      const mintCall = {
        contractAddress: gameTokenAddress,
        entrypoint: "mint_game",
        calldata: CallData.compile([
          new CairoOption(CairoOptionVariant.Some, shortString.encodeShortString(playerName)), // player_name
          new CairoOption(CairoOptionVariant.None), // settings_id
          1, // start
          1, // end
          1, // objective_ids
          1, // context
          1, // client_url
          1, // renderer_address
          account.address, // to
          false, // not soulbound (game is transferrable)
        ]),
      };

      try {
        const tx = await account.execute([mintCall]);

        const receipt: any = await rpcProvider.waitForTransaction(tx.transaction_hash, {
          retryInterval: 200,
        });

        // Extract token_id from the Transfer event
        // Transfer event in StarkNet ERC721 has 5 keys: [selector, from, to, tokenId_low, tokenId_high]
        const transferEvent = receipt.events?.find((event: any) => {
          // Transfer event has 5 keys and 0 data fields
          return event.keys && event.keys.length === 5 && event.keys[1] === "0x0";
        });

        const tokenId = transferEvent ? parseInt(transferEvent.keys[3], 16) : undefined;

        if (!tokenId) {
          toast({
            message: "Failed to extract token ID from mint transaction",
            duration: 5_000,
            isError: true,
          });
        }

        return {
          hash: tx.transaction_hash,
          receipt,
          tokenId,
        };
      } catch (e: any) {
        toast({
          message: e ? tryBetterErrorMsg(e.toString()) : "Failed to mint game token",
          duration: 10_000,
          isError: true,
        });
        throw e;
      }
    },
    [gameTokenAddress, account, rpcProvider, toast],
  );

  const createGame = useCallback(
    async (
      gameMode: GameMode,
      playerName: string,
      multiplier: number,
      tokenIdType: number,
      tokenId: number,
      minigameTokenId: number,
    ) => {
      const paperFee = BigInt(config?.ryo.paper_fee * multiplier) * ETHER;
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
          shortString.encodeShortString(playerName),
          multiplier,
          tokenIdType,
          tokenId,
          minigameTokenId,
        ]),
      };

      const createGameCalls = await buildRandomnessCalls({
        account: account!,
        call: createGameCall,
        chainConfig: selectedChain,
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
    async (tokenId: string, calls: Array<PendingCall>) => {
      const callsEnum = calls.map(pendingCallToCairoEnum);

      const { hash } = await executeAndReceipt({
        contractAddress: gameAddress,
        entrypoint: "end_game",
        // @ts-ignore
        calldata: CallData.compile({ tokenId, callsEnum }),
      });

      return {
        hash,
      };
    },
    [executeAndReceipt],
  );

  const travel = useCallback(
    async (tokenId: string, location: Locations, pending_calls: Array<PendingCall>) => {
      const callsEnum = pending_calls.map(pendingCallToCairoEnum);

      const call = {
        contractAddress: gameAddress,
        entrypoint: "travel",
        // @ts-ignore
        calldata: CallData.compile({ tokenId, location, callsEnum }),
      };

      const calls = await buildRandomnessCalls({
        account: account!,
        call,
        chainConfig: selectedChain,
      });

      const { hash } = await executeAndReceipt(calls);

      return {
        hash,
      };
    },
    [executeAndReceipt, selectedChain],
  );

  const decide = useCallback(
    async (tokenId: string, action: EncountersAction) => {
      const call = {
        contractAddress: decideAddress,
        entrypoint: "decide",
        calldata: CallData.compile([tokenId, action]),
      };

      const calls = await buildRandomnessCalls({
        account: account!,
        call,
        chainConfig: selectedChain,
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
    async (tokenId: string, prevGameId: string, prevPlayerId: string) => {
      const calls = [
        {
          contractName: `laundromat`,
          entrypoint: "register_score",
          // @ts-ignore
          calldata: CallData.compile([tokenId, prevGameId, prevPlayerId]),
        },
      ];

      // Note: We still need to query the game to check for loot_id for DopeLoot release
      // But we need to get game_id first from token_id via GameToken model
      const playerId = account?.address;

      // TODO: Query GameToken to get game_id from token_id, then query Game
      // For now, keeping the existing logic but it needs to be updated
      const gameEntities = await toriiClient.getEntities({
        clause: {
          Keys: {
            keys: [Number(tokenId).toString(), playerId],
            models: ["dopewars-Game"],
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
        models: ["dopewars-Game"],
        historical: false,
      });

      if (Object.keys(gameEntities).length > 0) {
        // retrieve loot_id used with game_id
        const game = parseModels(gameEntities, "dopewars-Game")[0];

        let lootId = 0;
        // @ts-ignore
        if (game.token_id.activeVariant() === "LootId") {
          // @ts-ignore
          lootId = Number(game.token_id.unwrap());
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
    async (playerId: string, tokenIds: number[]) => {
      const { hash, events, parsedEvents } = await executeAndReceipt({
        contractName: `laundromat`,
        entrypoint: "claim",
        calldata: [playerId, tokenIds],
        // calldata: CallData.compile([playerId, tokenIds]),
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

      const calls = await buildRandomnessCalls({
        account: account!,
        call,
        chainConfig: selectedChain,
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
    async (tokenId: number) => {
      const slotMachineAddress = dojoProvider.manifest.contracts.find(
        (i: any) => i.tag === `${DW_NS}-slotmachine`,
      ).address;

      const call = {
        contractAddress: slotMachineAddress,
        entrypoint: "roll",
        calldata: [tokenId],
      };
      const calls = await buildRandomnessCalls({
        account: account!,
        call,
        chainConfig: selectedChain,
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
    mintGameToken,
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
