import { DojoBurnerStarknetWindowObject } from "@/components/wallet/inpage/starknetWindowObject";
import { BurnerManager } from "@dojoengine/create-burner";
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
  masterAccount: AccountInterface | undefined;
  burnerManager: BurnerManager;
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

  const { selectedChain, setSelectedChain, isKatana, chains } = useDojoChains(dojoContextConfig);

  const { dojoProvider, queryClient, graphqlClient, graphqlWsClient, rpcProvider } = useDojoClients(selectedChain);

  const masterAccount = useMemo(() => {
    if (selectedChain.masterAddress && selectedChain.masterPrivateKey) {
      return new Account(rpcProvider, selectedChain.masterAddress, selectedChain.masterPrivateKey, "1");
    }
    return undefined;
  }, [rpcProvider, selectedChain.masterAddress, selectedChain.masterPrivateKey]);

  const burnerManager = useMemo(() => {
    if (!masterAccount) return undefined;

    console.log("new BurnerManager");

    return new BurnerManager({
      masterAccount: masterAccount!,
      accountClassHash: selectedChain.accountClassHash!,
      rpcProvider: rpcProvider,
    });
  }, [masterAccount, selectedChain.accountClassHash, rpcProvider]);

  useEffect(() => {
    const init_async = async () => {

      // if (window.starknet_dojoburner && !burnerManager) {
      //   window.starknet_dojoburner = undefined;
      // }

      if (window.starknet_dojoburner && burnerManager) {
        // initialize burnerManager
        await burnerManager.init();

        // setBurnerManager
        (window.starknet_dojoburner as DojoBurnerStarknetWindowObject).setBurnerManager(burnerManager);

        if (!(window.starknet_dojoburner as DojoBurnerStarknetWindowObject).burnerManager.getActiveAccount()) {
          // create burner
          await (window.starknet_dojoburner as DojoBurnerStarknetWindowObject).burnerManager.create();
        }
      }
    };
    init_async();
  }, [burnerManager]);

  // const {
  //   create,
  //   list,
  //   get,
  //   account,
  //   select,
  //   isDeploying,
  //   clear,
  //   copyToClipboard,
  //   applyFromClipboard,
  //   listConnectors,
  // } = useBurnerManager({
  //   burnerManager: new BurnerManager({
  //     masterAccount: masterAccount!,
  //     accountClassHash: selectedChain.accountClassHash!,
  //     rpcProvider: rpcProvider,
  //   }),
  // });

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
    console.log("configStore.init");
    configStore.init();
  }, [configStore]);

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
