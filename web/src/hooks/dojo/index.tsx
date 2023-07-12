import { RYO_WORLD_ADDRESS } from "@/constants";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  Account,
  BigNumberish,
  CallData,
  shortString,
  TransactionStatus,
} from "starknet";

export const SCALING_FACTOR = 10000;
export const REFETCH_INTERVAL = 3000;

interface DojoInterface {
  account: Account;
  isPending: boolean;
  error?: Error;
  execute: (systemName: string, params: BigNumberish[]) => Promise<string>;
}

//@ts-ignore
const DojoContext = createContext<DojoInterface>(undefined);

export function useDojo() {
  const context = useContext(DojoContext);
  if (!context) {
    throw new Error("useDojo must be used within a DojoProvider");
  }
  return useContext(DojoContext);
}

export function DojoProvider({
  account,
  children,
}: {
  account: Account;
  children?: ReactNode;
}): JSX.Element {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error>();

  const execute = async (systemName: string, params: BigNumberish[]) => {
    setIsPending(true);
    setError(undefined);

    return account
      .execute({
        contractAddress: RYO_WORLD_ADDRESS,
        entrypoint: "execute",
        calldata: CallData.compile([
          shortString.encodeShortString(systemName),
          params.length,
          ...params,
        ]),
      })
      .then(async ({ transaction_hash }) => {
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 1000,
          successStates: [TransactionStatus.ACCEPTED_ON_L2],
        });

        console.log("transaction hash: " + transaction_hash);

        return transaction_hash;
      })
      .catch((e) => {
        console.error(e);
        setError(e);
        throw e;
      })
      .finally(() => setIsPending(false));
  };

  return (
    <DojoContext.Provider value={{ account, isPending, error, execute }}>
      {children}
    </DojoContext.Provider>
  );
}
