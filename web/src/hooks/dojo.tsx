import { createContext, ReactNode, useContext, useState } from "react";
import { Account, BigNumberish, CallData, shortString } from "starknet";

interface DojoInterface {
  worldAddress: string;
  account: Account;
  isPending: boolean;
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
  worldAddress,
  account,
  children,
}: {
  worldAddress: string;
  account: Account;
  children?: ReactNode;
}): JSX.Element {
  const [isPending, setIsPending] = useState(false);

  const execute = async (systemName: string, params: BigNumberish[]) => {
    setIsPending(true);

    return account
      .execute({
        contractAddress: worldAddress,
        entrypoint: "execute",
        calldata: CallData.compile([
          shortString.encodeShortString(systemName),
          params.length,
          ...params,
        ]),
      })
      .then(({ transaction_hash }) => {
        console.log("transaction hash: " + transaction_hash);
        return transaction_hash;
      })
      .catch((e) => {
        console.error(e);
        throw e;
      })
      .finally(() => setIsPending(false));
  };

  return (
    <DojoContext.Provider value={{ worldAddress, account, isPending, execute }}>
      {children}
    </DojoContext.Provider>
  );
}
