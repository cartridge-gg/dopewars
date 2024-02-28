import { useToast } from "@/hooks/toast";
import { useCallback, useState } from "react";
import { useDojoContext } from "./useDojoContext";

export interface FaucetInterface {
  faucet: () => Promise<SystemExecuteResult>;

  isPending: boolean;
  error?: string;
}

export interface FaucetExecuteResult {
  hash: string;
}


export const useFaucet = (): FaucetInterface => {
  const {
    account,
    dojoProvider
  } = useDojoContext();

  const { toast, clear: clearToasts } = useToast();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const faucet = useCallback(
    async (): Promise<FaucetExecuteResult> => {

      setError(undefined)
      setIsPending(true)

      let tx, receipt;
      try {
        tx = await dojoProvider.execute(account!, "rollyourown::_mocks::paper_mock::paper_mock", "faucet", []);

        receipt = await account!.waitForTransaction(tx.transaction_hash, {
          retryInterval: 200,
        });

      } catch (e: any) {
        setIsPending(false)
        setError(e.toString())
        toast({
          message: e.toString(),
          duration: 20_000,
          isError: true
        })
        throw Error(e.toString())
      }

      setIsPending(false)

      return {
        hash: tx?.transaction_hash,
      };

    },
    [dojoProvider, account, toast, clearToasts],
  );

  return {
    faucet,
    //
    error,
    isPending,
  };
};
