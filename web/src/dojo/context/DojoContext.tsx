import { BurnerAccount, BurnerManager, useBurnerManager } from "@dojoengine/create-burner";
import { Connector } from "@starknet-react/core";
import { ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { QueryClientProvider } from "react-query";
import { Account } from "starknet";
import { DojoChainsResult, useDojoChains } from "../hooks/useDojoChains";
import { DojoClientsResult, useDojoClients } from "../hooks/useDojoClients";
import { DojoContextConfig } from "../setup/config";
import { SetupResult } from "../setup/setup";
import { ConfigStoreClass } from "../stores/config";
import { GameStoreClass } from "../stores/game";

interface DojoContextType extends SetupResult {
  chains: DojoChainsResult;
  clients: DojoClientsResult;
  masterAccount: Account;
  account: Account | null;
  burner: BurnerAccount & { listConnectors: () => Connector[] };
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
  }, [rpcProvider, selectedChain]);

  const burnerManager = useMemo(() => {
    return new BurnerManager({
      masterAccount: masterAccount,
      accountClassHash: selectedChain.accountClassHash,
      rpcProvider: rpcProvider,
    });
  }, [masterAccount, selectedChain.accountClassHash, rpcProvider]);

  useEffect(() => {
    if (window.starknet_dojoburner) {
      //setBurnerManager
      window.starknet_dojoburner.setBurnerManager(burnerManager);
    }
  }, [burnerManager]);

  const {
    create,
    list,
    get,
    account,
    select,
    isDeploying,
    clear,
    copyToClipboard,
    applyFromClipboard,
    listConnectors,
  } = useBurnerManager({
    burnerManager: new BurnerManager({
      masterAccount: masterAccount,
      accountClassHash: selectedChain.accountClassHash,
      rpcProvider: rpcProvider,
    }),
  });

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

  // const { account } = useAccount();

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
        masterAccount,
        burner: {
          create,
          list,
          get,
          select,
          clear,
          listConnectors,
          account: account ? account : masterAccount,
          isDeploying,
          copyToClipboard,
          applyFromClipboard,
        },
        account,
        configStore,
        gameStore,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </DojoContext.Provider>
  );
};
