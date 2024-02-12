import { BurnerAccount, BurnerManager, useBurnerManager } from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext, useMemo, useRef } from "react";
import { Account, RpcProvider } from "starknet";
import { StoreApi } from "zustand";
import { SetupResult } from "../setup/setup";
import { ConfigStore, createConfigStore } from "../stores/config";
import { GameStore, createGameStore } from "../stores/game";

interface DojoContextType extends SetupResult {
  masterAccount: Account;
  account: Account | null;
  burner: BurnerAccount;
  configStore: StoreApi<ConfigStore>;
  gameStore: StoreApi<GameStore>;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoProvider = ({ children, value }: { children: ReactNode; value: SetupResult }) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");

  const {
    config: { rpcUrl, toriiUrl, masterAddress, masterPrivateKey, accountClassHash, manifest },
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

  const configStoreRef = useRef<StoreApi<ConfigStore>>();
  if (!configStoreRef.current) {
    configStoreRef.current = createConfigStore({
      client: value.graphqlClient,
      dojoProvider: value.dojoProvider,
      manifest: value.config.manifest,
    });
  }


  const gameStoreRef = useRef<StoreApi<GameStore>>();
  if (!gameStoreRef.current) {
    gameStoreRef.current = createGameStore({
      client: value.graphqlClient,
      wsClient: value.graphqlWsClient,
      configStore: configStoreRef.current,
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
        configStore: configStoreRef.current,
        gameStore: gameStoreRef.current,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};
