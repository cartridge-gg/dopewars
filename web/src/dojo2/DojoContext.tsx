import { createContext, ReactNode, useContext, useMemo } from "react";
import { SetupResult } from "./setup";
import { useBurner } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";

const DojoContext = createContext<SetupResult | null>(null);

type Props = {
    children: ReactNode;
    value: SetupResult;
};

export const DojoProvider = ({ children, value }: Props) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) throw new Error("DojoProvider can only be used once");
    return <DojoContext.Provider value={value}>{children}</DojoContext.Provider>;
};

export const useDojo = () => {
    const value = useContext(DojoContext);

    if (!value) throw new Error("The `useDojo` hook must be used within a `DojoProvider`");

    const provider = useMemo(() => new RpcProvider({
        nodeUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT!
    }), []);

    // 
    // this can be substituted with a wallet provider
    //
    const masterAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS!;
    const privateKey = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!;
    const masterAccount = useMemo(() => new Account(provider, masterAddress, privateKey), [provider, masterAddress, privateKey]);

    const { create, list, get, account, select, isDeploying, clear } = useBurner(
        {
            masterAccount: masterAccount,
            accountClassHash: process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH!
        }
    );

    return {
        setup: value,
        account: { create, list, get, select, clear, account: account ? account : masterAccount, isDeploying }
    };
};