import { createContext, ReactNode, useContext, useMemo } from "react";
import { SetupResult } from "../setup/setup";
import { useBurner } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";

export type RyoContext = {
  setup: SetupResult;
  account: Account;
  burner: {
    create: () => void;
    list: () => any[];
    get: (id: string) => any;
    select: (id: string) => void;
    account: Account | null;
    masterAccount: Account;
    isDeploying: boolean;
    clear: () => void;
  };
};

export const DojoContext = createContext<RyoContext | null>(null);

export const DojoProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: SetupResult;
}) => {
  const contextValue = useContext(DojoContext);
  if (contextValue) throw new Error("DojoProvider can only be used once");

  const masterAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS!;
  const privateKey = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!;

  const masterAccount = useMemo(() => {
    return new Account(
      {
        rpc: {
          nodeUrl: value.network.provider.provider.nodeUrl,
        },
      },
      masterAddress,
      privateKey,
    );
  }, [value.network.provider.provider, masterAddress, privateKey]);

  const burnerOptions = useMemo(() => {
    return {
      masterAccount: masterAccount,
      accountClassHash: process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH!,
    };
  }, [masterAccount]);

  const { create, list, get, account, select, isDeploying, clear } =
    useBurner(burnerOptions);

  const selectedAccount = useMemo(() => {
    return account;
  }, [account]);

  const ryoContext = {
    setup: value, // the provided setup
    account: selectedAccount,// the selected account
    //account: masterAccount, // use master account = full auth
    burner: {
      create, // create a new account
      list, // list all accounts
      get, // get an account by id
      select, // select an account by id
      account: selectedAccount,       // the selected account
      masterAccount, // the master account
      isDeploying, // is the account being deployed
      clear,
    },
  };

  return (
    <DojoContext.Provider value={ryoContext}>{children}</DojoContext.Provider>
  );
};
