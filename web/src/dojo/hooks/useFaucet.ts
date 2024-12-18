import { useToast } from "@/hooks/toast";
import { useAccount } from "@starknet-react/core";
import { useCallback, useState } from "react";
import { Account, Contract, TypedContractV2 } from "starknet";
import { ABI as paperAbi } from "../abis/paperAbi";

export interface FaucetExecuteResult {
  hash: string;
}

export interface FaucetInterface {
  faucet: () => Promise<FaucetExecuteResult>;
  isPending: boolean;
  error?: string;
}

export const useFaucet = (tokenAddress?: string): FaucetInterface => {
  const { account } = useAccount();

  const { toast } = useToast();

  const [isPending, setIsPending] = useState(false);
  // const [error, setError] = useState<string | undefined>(undefined);

  const faucet = useCallback(async (): Promise<FaucetExecuteResult> => {
    // setError(undefined);
    setIsPending(true);

    let tx, receipt;
    try {
      const contract: TypedContractV2<typeof paperAbi> = new Contract(paperAbi, tokenAddress!, account!).typedv2(
        paperAbi,
      );

      tx = await contract.invoke("faucet", [], { parseRequest: false });
      // tx = await contract.faucet();
      //tx = await dojoProvider.execute(account!, "rollyourown::_mocks::paper_mock::paper_mock", "faucet", []);

      toast({
        message: `tx sent ${tx.transaction_hash.substring(0, 4)}...${tx.transaction_hash.slice(-4)}`,
        duration: 5_000,
        isError: false,
      });

      receipt = await account!.waitForTransaction(tx.transaction_hash, {
        retryInterval: 500,
      });
    } catch (e: any) {
      console.log(e);
      setIsPending(false);
      // setError(e.toString());
      toast({
        message: e ? e.toString() : "unknown error",
        duration: 20_000,
        isError: true,
      });
    }

    setIsPending(false);

    return {
      hash: tx?.transaction_hash || "0x0",
    };
  }, [tokenAddress, account, toast]);

  return {
    faucet,
    //
    // error,
    isPending,
  };
};

export const paperFaucet = async ({ account, paperAddress }: { account: Account; paperAddress: string }) => {
  const contract: TypedContractV2<typeof paperAbi> = new Contract(paperAbi, paperAddress!, account!).typedv2(paperAbi);

  const tx = await contract.invoke("faucet", [], { parseRequest: false });

  const receipt = await account!.waitForTransaction(tx.transaction_hash, {
    retryInterval: 500,
  });
};
