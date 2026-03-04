// Starknet/wallet hooks are mocked at the module level for Storybook.
// @storybook/nextjs + webpack aliases handle most of this automatically.
//
// For components using useAccount/useConnect from @starknet-react/core,
// we mock these via Storybook parameters or webpack module aliases.
//
// Example Storybook parameter override:
// parameters: {
//   mockData: {
//     account: { address: '0x1234...', isConnected: true },
//   },
// },

export const mockAccount = {
  address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  isConnected: true,
  status: "connected" as const,
  chainId: "SN_MAIN",
};

export const mockConnectors = [
  {
    id: "mock-connector",
    name: "Mock Wallet",
    available: () => true,
  },
];
