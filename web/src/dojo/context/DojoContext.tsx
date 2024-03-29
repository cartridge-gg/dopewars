import RegisterEntities from "@/components/RegisterEntities";
import ConnectionError from "@/components/layout/ConnectionError";
import { Loader } from "@/components/layout/Loader";
import { StarknetProvider } from "@/components/wallet";
import { Flex, VStack } from "@chakra-ui/react";
import {
  BurnerManager,
  PredeployedManager,
  useBurnerWindowObject,
  usePredeployedWindowObject,
} from "@dojoengine/create-burner";
import { observer } from "mobx-react-lite";
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
  predeployedManager?: PredeployedManager;
  configStore: ConfigStoreClass;
  gameStore: GameStoreClass;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoContextProvider = observer(
  ({ children, dojoContextConfig }: { children: ReactNode; dojoContextConfig: DojoContextConfig }) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) throw new Error("DojoProvider can only be used once");

    const [configStoreState, setConfigStoreState] = useState({
      isInitialized: false,
      isError: false,
      error: undefined,
    });

    const defaultChain =
      process.env.NODE_ENV === "production" ? dojoContextConfig.KATANA_SLOT_420 : dojoContextConfig.KATANA;

    const lastSelectedChainId =
      typeof window !== "undefined" ? window?.localStorage?.getItem("lastSelectedChainId") : undefined;
    const intialChain =
      lastSelectedChainId && dojoContextConfig[lastSelectedChainId as SupportedChainIds]
        ? dojoContextConfig[lastSelectedChainId as SupportedChainIds]
        : defaultChain;

    const { selectedChain, setSelectedChain, isKatana, chains } = useDojoChains(dojoContextConfig, intialChain);

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

    const {
      isInitialized: burnerSWOIsInitialized,
      isError: burnerSWOIsError,
      error: burnerSWOError,
    } = useBurnerWindowObject(burnerManager);
    
    const {
      isInitialized: predeployedSWOIsInitialized,
      isError: predeployedSWOIsError,
      error: predeployedSWOError,
    } = usePredeployedWindowObject(predeployedManager);

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
      const initAsync = async () => {
        if(!configStore) return
        try {
          await configStore.init();
          setConfigStoreState({
            isInitialized: true,
            isError: false,
            error: undefined,
          });
        } catch (e) {
          setConfigStoreState({
            isInitialized: false,
            isError: true,
            error: "faild to init configStore",
          });
        }
      };
      initAsync();
    }, [configStore]);

    const isInitialized = burnerSWOIsInitialized && predeployedSWOIsInitialized && configStoreState.isInitialized;
    const hasError = burnerSWOIsError || predeployedSWOIsError || configStoreState.isError;
    const errors = hasError ? [burnerSWOError, predeployedSWOError, configStoreState.error] : [];

    // console.log("isInitialized", isInitialized);
    // console.log("hasError", hasError);
    
    // is initializing
    if (!hasError && !isInitialized)
      return (
        <Flex minH="100vh" alignItems="center" justifyContent="center">
          <VStack>
            <Loader />
          </VStack>
        </Flex>
      );

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
        <StarknetProvider>
          {hasError ? (
            <ConnectionError errors={errors} />
          ) : (
            <>
              <QueryClientProvider client={queryClient}>
                <RegisterEntities />
                {children}
              </QueryClientProvider>
            </>
          )}
        </StarknetProvider>
      </DojoContext.Provider>
    );
  },
);
