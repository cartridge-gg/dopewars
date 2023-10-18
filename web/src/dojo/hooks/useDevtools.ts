import { useCallback } from "react";
import { useDojoContext } from "./useDojoContext";
// import { BaseEventData, parseEvent, parseEvents, WorldEvents } from "../events";
import { Action, GameMode, Location, ItemEnum } from "../types";
import { shortString, GetTransactionReceiptResponse, BigNumberish } from "starknet";
import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";
import { parseAllEvents } from "../events";
import { WorldEvents } from "../generated/contractEvents";
import { SystemExecuteResult } from "./useSystems";

export interface SystemsInterface {
  feedLeaderboard: (
    count: number,
  ) => Promise<SystemExecuteResult>;

  // isPending: boolean;
  // error?: Error;
}


export const useDevtools = (): SystemsInterface => {
  const {
    burner: {
      masterAccount
    },
    setup: {
      network: { provider, execute, call },
    },
  } = useDojoContext();

  const executeAndReceipt = useCallback(
    async (
      contract: string,
      system: string,
      callData: BigNumberish[],
    ): Promise<{
      hash: string;
      receipt: GetTransactionReceiptResponse;
    }> => {

      const tx = await execute(masterAccount, contract, system, callData);
      const receipt = await masterAccount.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      return {
        hash: tx.transaction_hash,
        receipt
      };
    },
    [execute, masterAccount],
  );

  const feedLeaderboard = useCallback(
    async (count: number) => {
      const { hash, receipt, } = await executeAndReceipt(
        "devtools",
        "feed_leaderboard",
        [count],
      );

      return {
        hash,
        receipt
      };
    },
    [executeAndReceipt],
  );



  return {
    feedLeaderboard,
  };
};
