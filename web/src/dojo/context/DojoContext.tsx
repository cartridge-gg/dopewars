import {
  BurnerManager,
  PredeployedManager,
  useBurnerWindowObject,
  usePredeployedWindowObject
} from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { QueryClientProvider } from "react-query";
import { Account, AccountInterface } from "starknet";
import { DojoChainsResult, useDojoChains } from "../hooks/useDojoChains";
import { DojoClientsResult, useDojoClients } from "../hooks/useDojoClients";
import { DojoContextConfig } from "../setup/config";
import { ConfigStoreClass } from "../stores/config";
import { GameStoreClass } from "../stores/game";

interface DojoContextType {
  chains: DojoChainsResult;
  clients: DojoClientsResult;
  masterAccount?: AccountInterface;
  burnerManager?: BurnerManager;
  predeployedManager?: PredeployedManager;
  configStore: ConfigStoreClass;
  gameStore: GameStoreClass;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoContextProvider = ({
  children,
  dojoContextConfig,
}: {
  children: ReactNode;
  dojoContextConfig: DojoContextConfig;
}) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");


  const defaultChain =
    process.env.NODE_ENV === "production" ? dojoContextConfig.KATANA_SLOT_420 : dojoContextConfig.KATANA;

  const { selectedChain, setSelectedChain, isKatana, chains } = useDojoChains(dojoContextConfig, defaultChain);

  const { dojoProvider, queryClient, graphqlClient, graphqlWsClient, rpcProvider } = useDojoClients(selectedChain);

  const masterAccount = useMemo(() => {
    if (selectedChain.masterAddress && selectedChain.masterPrivateKey) {
      return new Account(rpcProvider, selectedChain.masterAddress, selectedChain.masterPrivateKey, "1");
    }
    return undefined;
  }, [rpcProvider, selectedChain.masterAddress, selectedChain.masterPrivateKey]);

  const burnerManager = useMemo(() => {
    if (!masterAccount) return undefined;
    // console.log("new BurnerManager");

    return new BurnerManager({
      masterAccount: masterAccount!,
      accountClassHash: selectedChain.accountClassHash!,
      rpcProvider: rpcProvider,
    });
  }, [masterAccount, selectedChain.accountClassHash, rpcProvider]);

  const predeployedManager = useMemo(() => {
    if (!selectedChain.predeployedAccounts || selectedChain.predeployedAccounts.length === 0) return undefined;
    // console.log("new BurnerManager");

    return new PredeployedManager({
      rpcProvider: rpcProvider,
      predeployedAccounts: selectedChain.predeployedAccounts,
    });
  }, [rpcProvider, selectedChain.predeployedAccounts]);

  const { isInitialized: burnerSWOInitialized} = useBurnerWindowObject(burnerManager);
  const { isInitialized: predeployedSWOInitialized} = usePredeployedWindowObject(predeployedManager);

  const configStore = useMemo(() => {
    return new ConfigStoreClass({
      client: graphqlClient,
      dojoProvider: dojoProvider,
      manifest: selectedChain.manifest,
    });
  }, [graphqlClient, dojoProvider, selectedChain.manifest]);

  const gameStore = useMemo(() => {
    return new GameStoreClass({
      client: graphqlClient,
      wsClient: graphqlWsClient,
      configStore,
    });
  }, [graphqlClient, graphqlWsClient, configStore]);

  useEffect(() => {
    configStore.init();
  }, [configStore]);


  if (!(burnerSWOInitialized && predeployedSWOInitialized)) return null;

  return (
    <DojoContext.Provider
      value={{
        chains: {
          dojoContextConfig,
          selectedChain,
          setSelectedChain,
          isKatana,
          chains,
        },
        clients: {
          dojoProvider,
          queryClient,
          graphqlClient,
          graphqlWsClient,
          rpcProvider,
        },
        burnerManager,
        predeployedManager,
        masterAccount,
        configStore,
        gameStore,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </DojoContext.Provider>
  );
};
