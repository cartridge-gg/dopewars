import { BurnerAccount, BurnerManager, useBurnerManager } from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext, useMemo, useRef } from "react";
import { Account, RpcProvider } from "starknet";
import { StoreApi } from "zustand";
import { SetupResult } from "../setup/setup";
import { ConfigStore, createConfigStore } from "../stores/config";
import { PlayerStore, createPlayerStore } from "../stores/player";

interface DojoContextType extends SetupResult {
  masterAccount: Account;
  account: Account | null;
  burner: BurnerAccount;
  playerStore: StoreApi<PlayerStore>;
  configStore: StoreApi<ConfigStore>;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoProvider = ({ children, value }: { children: ReactNode; value: SetupResult }) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");

  const {
    config: { rpcUrl, masterAddress, masterPrivateKey, accountClassHash, manifest },
  } = value;

  const rpcProvider = useMemo(
    () =>
      new RpcProvider({
        nodeUrl: rpcUrl,
      }),
    [rpcUrl],
  );

  const masterAccount = useMemo(
    () => new Account(rpcProvider, masterAddress, masterPrivateKey, "1"),
    [rpcProvider, masterAddress, masterPrivateKey],
  );

  const { create, list, get, account, select, isDeploying, clear, copyToClipboard, applyFromClipboard } =
    useBurnerManager({
      burnerManager: new BurnerManager({
        masterAccount,
        accountClassHash,
        rpcProvider,
      }),
    });

  const playerStoreRef = useRef<StoreApi<PlayerStore>>();
  if (!playerStoreRef.current) {
    playerStoreRef.current = createPlayerStore({
      client: value.graphqlClient,
      wsClient: value.graphqlWsClient,
    });
  }

  const configStoreRef = useRef<StoreApi<ConfigStore>>();
  if (!configStoreRef.current) {
    configStoreRef.current = createConfigStore({
      client: value.graphqlClient,
    });
  }

  return (
    <DojoContext.Provider
      value={{
        ...value,
        masterAccount,
        burner: {
          create,
          list,
          get,
          select,
          clear,
          account: account ? account : masterAccount,
          isDeploying,
          copyToClipboard,
          applyFromClipboard,
        },
        account,
        playerStore: playerStoreRef.current,
        configStore: configStoreRef.current,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};
