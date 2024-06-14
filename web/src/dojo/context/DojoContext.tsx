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
import { paperFaucet } from "../hooks/useFaucet";
import { DojoContextConfig, SupportedChainIds } from "../setup/config";
import { ConfigStoreClass } from "../stores/config";
import { GameStoreClass } from "../stores/game";
import { UiStore } from "../stores/ui";

interface DojoContextType {
  chains: DojoChainsResult;
  clients: DojoClientsResult;
  masterAccount?: AccountInterface;
  burnerManager?: BurnerManager;
  isPrefundingPaper: boolean;
  predeployedManager?: PredeployedManager;
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

    const [isPrefundingPaper, setIsPrefundingPaper] = useState(false);

    const defaultChain =
      process.env.NODE_ENV === "production" ? dojoContextConfig.SN_SEPOLIA : dojoContextConfig.KATANA;

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

      const manager = new BurnerManager({
        masterAccount: masterAccount!,
        accountClassHash: selectedChain.accountClassHash!,
        rpcProvider: rpcProvider,
        feeTokenAddress: selectedChain.chainConfig.nativeCurrency.address,
      });

      const afterDeploy = async ({ account, deployTx }: { account: Account; deployTx: string }) => {
        setIsPrefundingPaper(true);
        try {
          const receipt = await account!.waitForTransaction(deployTx, {
            retryInterval: 500,
          });
          await paperFaucet({ account, paperAddress: configStore.config?.ryoAddress.paper });
        } catch (e: any) {
          console.log("fail afterDeploy");
        }
        setIsPrefundingPaper(false);
      };

      manager.setAfterDeployingCallback(afterDeploy);

      return manager;
    }, [masterAccount, selectedChain.accountClassHash, rpcProvider]);

    const predeployedManager = useMemo(() => {
      if (!selectedChain.predeployedAccounts || selectedChain.predeployedAccounts.length === 0) return undefined;

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
            error: "failed to init configStore",
          });
        }
      };
      initAsync();
    }, [configStore]);

    const uiStore = new UiStore();

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
          isPrefundingPaper,
          predeployedManager,
          masterAccount,
          configStore,
          gameStore,
          uiStore,
        }}
      >
        <StarknetProvider selectedChain={selectedChain}>
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
