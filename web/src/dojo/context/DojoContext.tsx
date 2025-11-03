import RegisterEntities from "@/components/RegisterEntities";
import ConnectionError from "@/components/layout/ConnectionError";
import { Loader } from "@/components/layout/Loader";
import { BuyPaper, ConnectButton, StarknetProvider } from "@/components/wallet";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { QueryClientProvider } from "react-query";
import { Account, AccountInterface } from "starknet";
import { DojoChainsResult, useDojoChains } from "../hooks/useDojoChains";
import { DojoClientsResult, useDojoClients } from "../hooks/useDojoClients";
import { paperFaucet } from "../hooks/useFaucet";
import { DojoContextConfig, SupportedChainIds } from "../setup/config";
import { ConfigStoreClass } from "../stores/config";
import { GameStoreClass } from "../stores/game";
import { UiStore } from "../stores/ui";
import { useRouter } from "next/router";
import { DopeProvider } from "@/dope/store";
import { DojoContractResult, useDojoContract } from "../hooks";
import { HustlerPreviewFromLoot } from "@/dope/components";

export interface DojoContextType {
  chains: DojoChainsResult;
  clients: DojoClientsResult;
  contracts: DojoContractResult;
  configStore: ConfigStoreClass;
  gameStore: GameStoreClass;
  uiStore: UiStore;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoContextProvider = observer(
  ({ children, dojoContextConfig }: { children: ReactNode; dojoContextConfig: DojoContextConfig }) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) throw new Error("DojoProvider can only be used once");

    const [configStoreState, setConfigStoreState] = useState<{
      isInitialized: boolean;
      isError: boolean;
      error: string | undefined;
    }>({
      isInitialized: false,
      isError: false,
      error: undefined,
    });

    const defaultChain =
      process.env.NODE_ENV === "production"
        ? Object.values(dojoContextConfig)[0]
        : Object.values(dojoContextConfig)[1]
        ? Object.values(dojoContextConfig)[1]
        : Object.values(dojoContextConfig)[0];

    const lastSelectedChainId =
      typeof window !== "undefined" && process.env.NODE_ENV !== "production"
        ? window?.localStorage?.getItem("lastSelectedChainId")
        : undefined;

    const intialChain =
      lastSelectedChainId && dojoContextConfig[lastSelectedChainId as SupportedChainIds]
        ? dojoContextConfig[lastSelectedChainId as SupportedChainIds]
        : defaultChain;

    const { selectedChain, setSelectedChain, isKatana, chains } = useDojoChains(dojoContextConfig, intialChain);

    const { dojoProvider, queryClient, graphqlClient, rpcProvider, toriiClient } = useDojoClients(selectedChain);

    const { getDojoContract, getDojoContractManifest, getContractTagByAddress } = useDojoContract(selectedChain);

    const configStore = useMemo(() => {
      return new ConfigStoreClass({
        client: graphqlClient,
        dojoProvider: dojoProvider,
        manifest: selectedChain.manifest,
      });
    }, [graphqlClient, dojoProvider, selectedChain.manifest]);

    const router = useRouter();

    const gameStore = useMemo(() => {
      return new GameStoreClass({
        toriiClient,
        client: graphqlClient,
        configStore,
        router,
        selectedChain,
      });
    }, [graphqlClient, configStore, toriiClient]);

    useEffect(() => {
      const initAsync = async () => {
        if (!configStore) return;
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
            error: `failed to init configStore: ${e}`,
          });
        }
      };
      initAsync();
    }, [configStore]);

    const uiStore = new UiStore();

    const isInitialized = configStoreState.isInitialized && toriiClient !== undefined;
    const hasError = configStoreState.isError;
    const errors = hasError ? [configStoreState.error] : [];

    // console.log("isInitialized", isInitialized);
    // console.log("hasError", hasError);
    // is initializing
    if (!hasError && !isInitialized)
      return (
        <Flex minH="100dvh" alignItems="center" justifyContent="center">
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
            rpcProvider,
            toriiClient,
          },
          contracts: {
            getDojoContract,
            getDojoContractManifest,
            getContractTagByAddress,
          },
          configStore,
          gameStore,
          uiStore,
        }}
      >
        <StarknetProvider selectedChain={selectedChain}>
          {hasError ? (
            <>
              {/* <Box w="200px">
                <ConnectButton  />
              </Box>
              <BuyPaper paperAmount={1_000} /> */}
              {/* <DopeProvider toriiClient={toriiClient}>
                <HustlerPreviewFromLoot tokenId={420} />
              </DopeProvider> */}
              <ConnectionError errors={errors} />
            </>
          ) : (
            <>
              <DopeProvider toriiClient={toriiClient}>
                <QueryClientProvider client={queryClient}>
                  <RegisterEntities />
                  {children}
                </QueryClientProvider>
              </DopeProvider>
            </>
          )}
        </StarknetProvider>
      </DojoContext.Provider>
    );
  },
);
