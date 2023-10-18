
import { DojoContext } from "../context/DojoContext";
import { useContext, useMemo } from "react";

import { SetupResult } from "../setup/setup";
import { useBurner } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";

export type RyoContext = {
  setup: SetupResult;
  account: Account;
  burner: {
    create: () => void;
    // list: () => any[];
    // get: (id: string) => any;
    // select: (id: string) => void;
    // account: Account | null;
    masterAccount: Account;
    isDeploying: boolean;
    // clear: () => void;
  };
}

export const useDojoContext = () => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useDojoContext must be used within a DojoProvider");
  }
  //console.log("useDojoContext")

  // const provider = useMemo(
  //   () =>
  //     new RpcProvider({
  //       nodeUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT!,
  //     }),
  //   [],
  // );

  const masterAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS!;
  const privateKey = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!;

  const masterAccount = useMemo(() => {
    return new Account({
      rpc: {
        nodeUrl: value.network.provider.provider.nodeUrl
      }
    }, masterAddress, privateKey)
  }, [value.network.provider.provider, masterAddress, privateKey])

  // this breaks all
  // const { create, list, get, account, select, isDeploying, clear } = useBurner({
  //   masterAccount: masterAccount,
  //   accountClassHash: process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH!
  // });

  // const selectedAccount = useMemo(() => {
  //   return account;
  // }, [account])

  const contextValue: RyoContext = {
    setup: value,    // the provided setup
    // account: selectedAccount,// the selected account
    account: masterAccount, // use master account = full auth
    burner: {
      create: () => { },
      isDeploying: false,
      masterAccount
    },
    // burner: {
    //   create,        // create a new account
    //   list,          // list all accounts
    //   get,           // get an account by id
    //   select,        // select an account by id
    //   //account: selectedAccount,       // the selected account
    //   masterAccount, // the master account
    //   isDeploying,   // is the account being deployed
    //   clear
    // }
  }

  return contextValue;
}

