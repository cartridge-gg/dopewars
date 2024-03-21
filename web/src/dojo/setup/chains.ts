import { Chain } from "@starknet-react/chains";

export const katanaLocalChain = {
    // id: BigInt("0x4b4154414e415f4c4f43414c"), // KATANA_LOCAL
    id: BigInt("0x4b4154414e41"), // KATANA
    network: "katana",
    name: "Katana Local",
    nativeCurrency: {
        address:
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
    testnet: true,

    rpcUrls: {
        default: {
            http: ["https://localhost:5050",],
        },
        public: {
            http: ["https://localhost:5050",],
        },
    },
    explorers: {
        worlds: ["https://worlds.dev"],
    },
} as const satisfies Chain;


export const katanaSlotChain = {
    id: BigInt("0x4b4154414e41"), // KATANA
    network: "katana",
    name: "Katana Slot",
    nativeCurrency: {
        address:
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },

    rpcUrls: {
        default: {
            http: ["https://api.cartridge.gg/x/ryo420/katana",],
        },
        public: {
            http: ["https://api.cartridge.gg/x/ryo420/katana",],
        },
    },
    explorers: {
        worlds: ["https://worlds.dev"],
    },
} as const satisfies Chain;
