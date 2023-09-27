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
  TransactionFinalityStatus,
  RpcProvider
} from "starknet";

// import { useBurner } from "../hooks/burner";
import { useBurner } from "@dojoengine/create-burner"

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

const provider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT!,
});

const admin = new Account(
  provider,
  process.env.NEXT_PUBLIC_ADMIN_ADDRESS!,
  process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!,
);

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
  } = useBurner({
     masterAccount:admin,
     accountClassHash: "0x04d07e40e93398ed3c76981e72dd1fd22557a78ce36c0515f679e27f0bb5bc5f"
      });

  const execute = useCallback(
    async (systemName: string, params: BigNumberish[]) => {
      if (!account) {
        throw new Error("No account connected");
      }

      setIsPending(true);
      setError(undefined);

      return account
        .execute(
          {
            contractAddress: RYO_WORLD_ADDRESS,
            entrypoint: "execute",
            calldata: CallData.compile([
              shortString.encodeShortString(systemName),
              params.length,
              ...params,
            ]),
          },
          undefined,
          { maxFee: 0 },
        )
        .then(async ({ transaction_hash }) => {
          await account.waitForTransaction(transaction_hash, {
            retryInterval: 1000,
            successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
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
