import { katana_localhost, katana_slot } from "@/components/wallet/chain/katana";
import { BurnerAccount, BurnerManager, useBurnerManager } from "@dojoengine/create-burner";
import { Chain, goerli, mainnet } from "@starknet-react/chains";
import { Connector } from "@starknet-react/core";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Account, RpcProvider } from "starknet";
import { StoreApi } from "zustand";
import { SetupResult } from "../setup/setup";
import { ConfigStore, createConfigStore } from "../stores/config";
import { GameStore, createGameStore } from "../stores/game";
import { RyoStore, createRyoStore } from "../stores/ryo";

interface DojoContextType extends SetupResult {
  network: {
    chains: Chain[];
    selectedChain: Chain;
    setSelectedChain: Dispatch<SetStateAction<any>>;
    isKatana: boolean;
  };
  masterAccount: Account;
  account: Account | null;
  burner: BurnerAccount & { listConnectors: () => Connector[] };
  configStore: StoreApi<ConfigStore>;
  gameStore: StoreApi<GameStore>;
  ryoStore: StoreApi<RyoStore>;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoProvider = ({ children, value }: { children: ReactNode; value: SetupResult }) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");

  const {
    config: { rpcUrl, toriiUrl, masterAddress, masterPrivateKey, accountClassHash, manifest },
  } = value;

  const chains = [katana_localhost, katana_slot, goerli, mainnet];
  const [selectedChain, setSelectedChain] = useState(
    process.env.NODE_ENV === "production" ? katana_slot : katana_localhost,
  );
  const [isKatana, setIsKatana] = useState(process.env.NODE_ENV === "production" ? true : false);

  useEffect(() => {
    setIsKatana(selectedChain.network.startsWith("katana_"));
  }, [selectedChain]);

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

  const ryoStoreRef = useRef<StoreApi<RyoStore>>();
  if (!ryoStoreRef.current) {
    ryoStoreRef.current = createRyoStore({
      client: value.graphqlClient,
      wsClient: value.graphqlWsClient,
      configStore: configStoreRef.current,
    });
  }

  return (
    <DojoContext.Provider
      value={{
        ...value,
        network: {
          chains,
          selectedChain,
          setSelectedChain,
          isKatana,
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
        configStore: configStoreRef.current,
        gameStore: gameStoreRef.current,
        ryoStore: ryoStoreRef.current,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};
