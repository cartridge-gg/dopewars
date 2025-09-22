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
      http: ["http://localhost:5050"],
    },
    public: {
      http: ["http://localhost:5050"],
    },
  },
  paymasterRpcUrls: {
    avnu: {
      http: ["http://localhost:5050"],
    },
  },
  explorers: {
    worlds: ["https://worlds.dev"],
  },
} as const satisfies Chain;

export const katanaSlotDopewarsChain = {
  id: BigInt(shortString.encodeShortString("WP_DOPEWARS")),
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
      http: ["https://api.cartridge.gg/x/dopewars/katana"],
    },
    public: {
      http: ["https://api.cartridge.gg/x/dopewars/katana"],
    },
  },
  paymasterRpcUrls: {
    avnu: {
      http: ["https://api.cartridge.gg/x/dopewars/katana"],
    },
  },
  explorers: {
    worlds: ["https://worlds.dev"],
  },
} as const satisfies Chain;
