import { createContext, ReactNode, useContext, useEffect } from "react";
import { Account, BigNumberish, CallData, num, shortString } from "starknet";

interface DojoInterface {
  worldAddress: string;
  account: Account;
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
  const execute = async (systemName: string, params: BigNumberish[]) => {
    const { transaction_hash } = await account.execute({
      contractAddress: worldAddress,
      entrypoint: "execute",
      calldata: CallData.compile([
        shortString.encodeShortString(systemName),
        params.length,
        ...params,
      ]),
    });

    console.log("transaction hash: " + transaction_hash);

    // katana tx are instant
    //await account.waitForTransaction(transaction_hash);

    return transaction_hash;
  };

  return (
    <DojoContext.Provider value={{ worldAddress, account, execute }}>
      {children}
    </DojoContext.Provider>
  );
}
