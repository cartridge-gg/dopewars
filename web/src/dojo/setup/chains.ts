import { Chain } from "@starknet-react/chains";
import { shortString } from "starknet";

export const katanaLocalChain = {
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
    default: {
      http: ["https://localhost:5050"],
    },
    public: {
      http: ["https://localhost:5050"],
    },
  },
  explorers: {
    worlds: ["https://worlds.dev"],
  },
} as const satisfies Chain;

export const katanaSlot1Chain = {
  id: BigInt(shortString.encodeShortString("WP_RYO1")),
  network: "katana",
  name: "Katana Slot 1",
  nativeCurrency: {
    address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },

  rpcUrls: {
    default: {
      http: ["https://api.cartridge.gg/x/ryo1/katana"],
    },
    public: {
      http: ["https://api.cartridge.gg/x/ryo1/katana"],
    },
  },
  explorers: {
    worlds: ["https://worlds.dev"],
  },
} as const satisfies Chain;

export const katanaSlot2Chain = {
  id: BigInt(shortString.encodeShortString("WP_RYO2")),
  network: "katana",
  name: "Katana Slot 2",
  nativeCurrency: {
    address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },

  rpcUrls: {
    default: {
      http: ["https://api.cartridge.gg/x/ryo2/katana"],
    },
    public: {
      http: ["https://api.cartridge.gg/x/ryo2/katana"],
    },
  },
  explorers: {
    worlds: ["https://worlds.dev"],
  },
} as const satisfies Chain;
