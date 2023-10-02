import { createContext, ReactNode, useContext, useMemo } from "react";
import { SetupResult } from "../setup/setup";
import { useBurner } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";

export const DojoContext = createContext<RyoContext | null>(null);

export type RyoContext = {
    setup: SetupResult;
    account: Account;
    burner: {
        create: () => void;
        list: () => any[];
        get: (id: string) => any;
        select: (id: string) => void;
        account: Account;
        masterAccount: Account;
        isDeploying: boolean;
        clear: () => void;
    };
}

type Props = {
    children: ReactNode;
    value: SetupResult;
};

export const DojoProvider = ({ children, value }: Props) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) throw new Error("DojoProvider can only be used once");

    const provider = useMemo(
        () =>
            new RpcProvider({
                nodeUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT!,
            }),
        [],
    );

  
    const masterAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS!;
    const privateKey = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!;
    const masterAccount = useMemo(() => new Account(provider, masterAddress, privateKey), [provider, masterAddress, privateKey]);
  
    const { create, list, get, account, select, isDeploying, clear } = useBurner({
        masterAccount: masterAccount,
        accountClassHash: process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH!
    });

    const selectedAccount = useMemo(() => {
        return account ; 
    }, [account])

    const contextValue: RyoContext = {
        setup: value,    // the provided setup
       // account: selectedAccount,// the selected account
        account: masterAccount, // use master account = full auth
        burner: {
            create,        // create a new account
            list,          // list all accounts
            get,           // get an account by id
            select,        // select an account by id
            account: selectedAccount,       // the selected account
            masterAccount, // the master account
            isDeploying,   // is the account being deployed
            clear
        }
    }

    return <DojoContext.Provider value={contextValue}>{children}</DojoContext.Provider>;
};

