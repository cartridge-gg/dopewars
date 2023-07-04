import { createContext, ReactNode, useContext } from "react";
import { Account, CallData, shortString } from "starknet";

interface DojoInterface {
  worldAddress: string;
  account: Account;
  execute: (systemName: string, calldata: CallData[]) => Promise<string | void>;
}

const DojoContext = createContext<DojoInterface>(undefined);

export function useDojo() {
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
  const execute = async (systemName: string, calldata: CallData[]) => {
    const data = calldata ? [...calldata, 0] : 0;
    const { transaction_hash } = await account.execute({
      contractAddress: worldAddress,
      entrypoint: "execute",
      calldata: CallData.compile({
        name: shortString.encodeShortString(systemName),
        data,
      }),
    });

    console.log("transaction hash: " + transaction_hash);
    await account.waitForTransaction(transaction_hash);
    return transaction_hash;
  };

  return (
    <DojoContext.Provider value={{ worldAddress, account, execute }}>
      {children}
    </DojoContext.Provider>
  );
}
