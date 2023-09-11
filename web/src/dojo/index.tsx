import { RYO_WORLD_ADDRESS } from "@/constants";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  Account,
  BigNumberish,
  CallData,
  shortString,
  TransactionStatus,
} from "starknet";
import { useBurner } from "../hooks/burner";

export const SCALING_FACTOR = 10000;
export const REFETCH_INTERVAL = 1000; // really need graphql subscriptions...

interface DojoInterface {
  account?: Account;
  isPending: boolean;
  isBurnerDeploying: boolean;
  error?: Error;
  createBurner: () => Promise<string>;
  execute: (systemName: string, params: BigNumberish[]) => Promise<string>;
  call: () => void;
}

const DojoContext = createContext<DojoInterface>(null!);

export function useDojo() {
  const context = useContext(DojoContext);
  if (!context) {
    throw new Error("useDojo must be used within a DojoProvider");
  }
  return useContext(DojoContext);
}

export function DojoProvider({
  children,
}: {
  children?: ReactNode;
}): JSX.Element {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error>();
  const {
    account,
    create: createBurner,
    isDeploying: isBurnerDeploying,
  } = useBurner();

  const execute = useCallback(
    async (systemName: string, params: BigNumberish[]) => {
      if (!account) {
        throw new Error("No account connected");
      }

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
    },
    [account],
  );

  // TODO: implement
  const call = useCallback(() => {
    console.error("not implemented");
  }, []);

  return (
    <DojoContext.Provider
      value={{
        account,
        isPending,
        isBurnerDeploying,
        error,
        call,
        execute,
        createBurner,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
}
