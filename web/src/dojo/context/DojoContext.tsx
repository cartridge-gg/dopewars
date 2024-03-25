import { BurnerManager, DojoBurnerStarknetWindowObject } from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
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

  const [snWindowObjectInitialized, setSnWindowObjectInitialized] = useState(false);

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

  useEffect(() => {
    const init_async = async () => {
      if (window.starknet_dojoburner && burnerManager) {
        try {
          // initialize burnerManager
          await burnerManager.init();
          // setBurnerManager
          (window.starknet_dojoburner as DojoBurnerStarknetWindowObject).setBurnerManager(burnerManager);
        } catch (e: any) {
          console.log(e);
        }
      }
      setSnWindowObjectInitialized(true);
    };
    init_async();
  }, [burnerManager]);

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

  if (!snWindowObjectInitialized) return null;

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
        masterAccount,
        configStore,
        gameStore,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </DojoContext.Provider>
  );
};
