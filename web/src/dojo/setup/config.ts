
// TODO import manifest by chain
import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import manifest from "../../../manifest.json";
import { katanaLocalChain, katanaSlot420Chain, katanaSlot421Chain } from "./chains";

export type SupportedChainIds = keyof typeof dojoContextConfig;

export type DojoContextConfig = typeof dojoContextConfig;

export type DojoChainConfig = {
    name: string;
    chainConfig: Chain;
    rpcUrl?: string;
    toriiUrl: string,
    toriiWsUrl: string,
    masterAddress?: string,
    masterPrivateKey?: string,
    accountClassHash?: string,
    manifest: any,
}

const katanaLocal: DojoChainConfig = {
    name: "KATANA",
    chainConfig: katanaLocalChain,
    rpcUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT || "http://localhost:5050",
    toriiUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8080/graphql",
    toriiWsUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_WS || "ws://localhost:8080/graphql/ws",
    masterAddress:
        process.env.NEXT_PUBLIC_ADMIN_ADDRESS ||
        "0x6162896d1d7ab204c7ccac6dd5f8e9e7c25ecd5ae4fcb4ad32e57786bb46e03",
    masterPrivateKey:
        process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY ||
        "0x1800000000300000180000000000030000000000003006001800006600",
    accountClassHash:
        process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH ||
        "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
    manifest,
}

const katanaSlot420: DojoChainConfig = {
    name: "SLOT 420",
    chainConfig: katanaSlot420Chain,
    rpcUrl: "https://api.cartridge.gg/x/ryo420/katana",
    toriiUrl: "https://api.cartridge.gg/x/ryo420/torii/graphql",
    toriiWsUrl: "wss://api.cartridge.gg/x/ryo420/torii/graphql/ws",
    masterAddress: "0x795abc2a2d5866f75c58025741329973db20966d1add5dd2a9fbdf0bb8a0266",
    masterPrivateKey: "0x2e8ac99614186737cefc47effe03134f5a19c6dc2443c16510d3384769f9c78",
    accountClassHash: "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
    manifest,
}

const katanaSlot421: DojoChainConfig = {
    name: "SLOT 421",
    chainConfig: katanaSlot421Chain,
    rpcUrl: "https://api.cartridge.gg/x/ryo421/katana",
    toriiUrl: "https://api.cartridge.gg/x/ryo421/torii/graphql",
    toriiWsUrl: "wss://api.cartridge.gg/x/ryo421/torii/graphql/ws",
    masterAddress: "0x7d806fc9478c73c60fac37c27888771bdb3092c21eb93452277e7673954d034",
    masterPrivateKey: "0x784b1dd14d761c414c6394fccca3ca1d1b0cac187e88122e4b06378f9e8c515",
    accountClassHash: "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
    manifest,
}

const snSepolia: DojoChainConfig = {
    name: "SEPOLIA",
    chainConfig: sepolia,
    rpcUrl: "https://api.cartridge.gg/rpc/starknet-sepolia",
    toriiUrl: "https://api.cartridge.gg/x/ryo_sepolia/torii/graphql",
    toriiWsUrl: "wss://api.cartridge.gg/x/ryo_sepolia/torii/graphql/ws",
    masterAddress: undefined,
    masterPrivateKey: undefined,
    accountClassHash: undefined,
    manifest,
}

const snMainnet: DojoChainConfig = {
    name: "MAINNET",
    chainConfig: mainnet,
    rpcUrl: undefined,
    toriiUrl: "https://api.cartridge.gg/x/ryo/torii/graphql",
    toriiWsUrl: "wss://api.cartridge.gg/x/ryo/torii/graphql/ws",
    masterAddress: undefined,
    masterPrivateKey: undefined,
    accountClassHash: undefined,
    manifest,
}


// keys must match chain.id
export const dojoContextConfig = {
    "KATANA": katanaLocal,
    "KATANA_SLOT_420": katanaSlot420,
    "KATANA_SLOT_421": katanaSlot421,
    "SN_SEPOLIA": snSepolia,
    "SN_MAIN": snMainnet,
}

export const dojoChains = [
    katanaLocal,
    katanaSlot420,
    katanaSlot421,
    snSepolia,
    snMainnet,
]


export const getStarknetProviderChains = (): Chain[] => {
    return Object.keys(dojoContextConfig).map((key) => {
        return dojoContextConfig[key as SupportedChainIds].chainConfig;
    })
}

