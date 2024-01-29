import { useCallback } from "react";
import { BigNumberish, GetTransactionReceiptResponse } from "starknet";
import { useDojoContext } from "./useDojoContext";
import { SystemExecuteResult } from "./useSystems";

export interface DevtoolsInterface {
  feedLeaderboard: (
    count: number,
  ) => Promise<SystemExecuteResult>;

  // isPending: boolean;
  // error?: Error;
}


export const useDevtools = (): DevtoolsInterface => {
  const {
    masterAccount,
    dojoProvider: {
      execute
    }
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
