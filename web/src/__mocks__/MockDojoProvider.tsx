import React, { ReactNode } from "react";
import { DojoContext, DojoContextType } from "@/dojo/context/DojoContext";
import { UiStore } from "@/dojo/stores/ui";
import { QueryClient, QueryClientProvider } from "react-query";
import { shortString } from "starknet";
import {
  createMockConfig,
  createMockGame,
  createMockGameConfig,
  createMockGameEvents,
  createMockGameInfos,
  createMockSeasonSettings,
} from "./mockData";

type MockOverrides = {
  game?: any;
  gameEvents?: any;
  gameInfos?: any;
  gameConfig?: any;
  seasonSettings?: any;
  config?: any;
  uiStore?: any;
};

const mockQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, enabled: false } },
});

const mockChain = {
  id: BigInt(shortString.encodeShortString("KATANA")),
  network: "katana",
  name: "Katana Local",
  nativeCurrency: {
    address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  testnet: true,
  rpcUrls: {
    default: { http: ["http://localhost:5050"] },
    public: { http: ["http://localhost:5050"] },
  },
  paymasterRpcUrls: { avnu: { http: ["http://localhost:5050"] } },
  explorers: { worlds: ["https://worlds.dev"] },
};

// Mock contracts that getContractByName can find
const mockContract = (tag: string) => ({
  tag,
  address: "0x0000000000000000000000000000000000000000000000000000000000000001",
  abi: [],
});

const mockManifest = {
  world: { address: "0x0" },
  contracts: [
    mockContract("dopewars_v0-game"),
    mockContract("dopewars_v0-decide"),
    mockContract("dopewars_v0-laundromat"),
    mockContract("dopewars_v0-config"),
    mockContract("dopewars_v0-ryo"),
    mockContract("dopewars_v0-devtools"),
    mockContract("dope-DopeLootClaim"),
    mockContract("dope-DopeLoot"),
    mockContract("dope-DopeGear"),
    mockContract("dope-DopeHustlers"),
  ],
};

const createMockConfigStore = (configOverride?: any) => {
  const config = configOverride ?? createMockConfig();
  return {
    client: {} as any,
    dojoProvider: {} as any,
    manifest: {},
    config,
    isLoading: false,
    isInitialized: true,
    error: undefined,
    init: function* () {},
    getDrug: (drugsMode: string, drug: string) =>
      config.drug.find(
        (d: any) => d.drug.toLowerCase() === drug.toLowerCase(),
      ),
    getDrugById: (drugsMode: string, drugId: number) =>
      config.drug.find((d: any) => Number(d.drug_id) === Number(drugId)),
    getLocation: (location: string) =>
      config.location.find(
        (l: any) => l.location.toLowerCase() === location.toLowerCase(),
      ),
    getLocationById: (locationId: number) =>
      config.location.find(
        (l: any) => Number(l.location_id) === Number(locationId),
      ),
    getGameStoreLayoutItem: (name: string) =>
      config.config.layouts.game_store.find((i: any) => i.name === name),
    getPlayerLayoutItem: (name: string) =>
      config.config.layouts.player.find((i: any) => i.name === name),
    getGearItemFull: (gearItem: any) => ({
      gearItem,
      name: "Mock Item",
      tier: 1,
      levels: [
        { cost: 0, stat: 0 },
        { cost: 100, stat: 10 },
        { cost: 200, stat: 20 },
        { cost: 300, stat: 30 },
      ],
    }),
    getGearItemTier: () => ({ tier: 1 }),
  };
};

const createMockGameStore = (overrides?: MockOverrides) => {
  const game = overrides?.game ?? createMockGame();
  const gameInfos = overrides?.gameInfos ?? createMockGameInfos();
  const gameConfig = overrides?.gameConfig ?? createMockGameConfig();
  const seasonSettings =
    overrides?.seasonSettings ?? createMockSeasonSettings();
  const gameEvents = overrides?.gameEvents ?? createMockGameEvents();

  return {
    toriiClient: {} as any,
    client: {} as any,
    configStore: {} as any,
    router: {} as any,
    selectedChain: {} as any,
    isInitialized: true,
    game,
    gameEvents,
    gameInfos,
    gameStorePacked: { packed: 0n },
    gameConfig,
    seasonSettings,
    subscriptions: [],
    allGamesCreated: [],
    reset: () => {},
    cleanSubscriptions: () => {},
    init: function* () {},
    loadGameInfos: function* () {},
    loadGameEvents: function* () {},
    loadSeasonSettings: function* () {},
    subscribe: function* () {},
    initGameStore: () => {},
    onEntityUpdated: () => {},
    onEventMessage: () => {},
    getGameCreated: function* () {},
  };
};

export const createMockDojoContext = (
  overrides?: MockOverrides,
): DojoContextType => {
  const configStore = createMockConfigStore(overrides?.config) as any;
  const gameStore = createMockGameStore(overrides) as any;
  const uiStore = overrides?.uiStore ?? new UiStore();

  // Link configStore to game if game exists
  if (gameStore.game) {
    gameStore.game.configStore = configStore;
  }
  gameStore.configStore = configStore;

  return {
    chains: {
      dojoContextConfig: {},
      selectedChain: {
        name: "Mock Chain",
        chainId: "MOCK",
        manifest: mockManifest,
        rpcUrl: "http://localhost:5050",
        toriiUrl: "http://localhost:8080",
        graphqlUrl: "http://localhost:8080/graphql",
        paperAddress: "0x0",
        vrfProviderAddress: "0x0",
        vrfProviderSecret: "",
        chainConfig: mockChain,
        slot: "ryo",
        namespace: "dopewars_v0",
      },
      setSelectedChain: () => {},
      isKatana: true,
      chains: [],
    } as any,
    clients: {
      dojoProvider: {
        manifest: mockManifest,
      } as any,
      queryClient: mockQueryClient as any,
      graphqlClient: {} as any,
      rpcProvider: {} as any,
      toriiClient: {} as any,
    },
    contracts: {
      getDojoContract: () => ({}) as any,
      getDojoContractManifest: () => ({}) as any,
      getContractTagByAddress: () => "" as any,
    },
    configStore,
    gameStore,
    uiStore,
  };
};

export const MockDojoProvider = ({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides?: MockOverrides;
}) => {
  const contextValue = createMockDojoContext(overrides);

  return (
    <QueryClientProvider client={mockQueryClient}>
      <DojoContext.Provider value={contextValue}>
        {children}
      </DojoContext.Provider>
    </QueryClientProvider>
  );
};

// Decorator factory for Storybook
export const withMockProviders = (overrides?: MockOverrides) => {
  return (Story: React.ComponentType) => (
    <MockDojoProvider overrides={overrides}>
      <Story />
    </MockDojoProvider>
  );
};
