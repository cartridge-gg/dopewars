// Fully self-contained mock for @starknet-react/core
// No imports from the real module to avoid circular alias resolution
import React from "react";

const MOCK_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

// Provider components - just render children
export const StarknetConfig = ({ children }: any) => children;

// Hook mocks
export const useAccount = () => ({
  account: {
    address: MOCK_ADDRESS,
    provider: {},
    waitForTransaction: async () => ({}),
    chainId: "0x534e5f4d41494e",
  },
  address: MOCK_ADDRESS,
  isConnected: true,
  isConnecting: false,
  isReconnecting: false,
  isDisconnected: false,
  status: "connected" as const,
  connector: { id: "mock", name: "Mock Wallet" },
  chainId: "0x534e5f4d41494e",
});

export const useConnect = () => ({
  connect: () => {},
  connectors: [
    { id: "mock", name: "Controller", available: () => true },
  ],
  isLoading: false,
  isSuccess: true,
  isError: false,
  error: null,
  pendingConnector: null,
});

export const useDisconnect = () => ({
  disconnect: () => {},
});

export const useNetwork = () => ({
  chain: { id: BigInt(0x534e5f4d41494e), name: "Mainnet" },
  chains: [],
});

export const useStarkName = () => ({
  data: undefined,
});

export const useBalance = () => ({
  data: { value: BigInt("1000000000000000000"), decimals: 18, symbol: "ETH" },
  isLoading: false,
});

export const useProvider = () => ({
  provider: {},
});

export const useExplorer = () => ({
  url: "https://starkscan.co",
});

// Connector utilities - no-ops
export const jsonRpcProvider = (_opts?: any) => () => ({});
export const starkscan = () => ({});
export const argent = () => ({});
export const injected = (_opts?: any) => ({});
export class InjectedConnector {
  constructor(_opts?: any) {}
}

// Type re-exports as empty types
export type Connector = any;
export type ChainProviderFactory<T = any> = any;
export type ExplorerFactory = any;
