import { Chain } from "@starknet-react/chains";

export const katana_localhost = {
    id: BigInt("0x4b4154414e41"),
    network: "katana_localhost",
    name: "Katana Dev",
    nativeCurrency: {
        address:
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
    testnet: true,

    rpcUrls: {
        public: {
            http: [
                "https://localhost:5050",
            ],
        },
    },
    explorers: {
        worlds: ["https://worlds.dev"],
    },
} as const satisfies Chain;


export const katana_slot = {
    id: BigInt("0x4b4154414e41"),
    network: "katana_slot",
    name: "Katana Slot",
    nativeCurrency: {
        address:
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },

    rpcUrls: {
        public: {
            http: [
                "https://api.cartridge.gg/x/ryo420/katana",
            ],
        },
    },
    explorers: {
        worlds: ["https://worlds.dev"],
    },
} as const satisfies Chain;
