// TODO import manifest by chain
import { PredeployedAccount } from "@dojoengine/create-burner";
import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import { katanaLocalChain, katanaSlot420Chain /*, katanaSlot421Chain */, katanaSlot421Chain } from "./chains";

import manifestDev from "../../manifests/dev/manifest.json";
import manifestRyo420 from "../../manifests/ryo420/manifest.json";
import manifestRyo421 from "../../manifests/ryo421/manifest.json";
import manifestRyoSepolia from "../../manifests/ryosepolia/manifest.json";

export type SupportedChainIds = keyof typeof dojoContextConfig;

export type DojoContextConfig = typeof dojoContextConfig;

export type DojoChainConfig = {
  name: string;
  chainConfig: Chain;
  rpcUrl?: string;
  toriiUrl: string;
  toriiWsUrl: string;
  masterAddress?: string;
  masterPrivateKey?: string;
  accountClassHash?: string;
  manifest: any;
  predeployedAccounts: PredeployedAccount[];
};

const katanaLocal: DojoChainConfig = {
  name: "KATANA",
  chainConfig: katanaLocalChain,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT || "http://localhost:5050",
  toriiUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8080/graphql",
  toriiWsUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_WS || "ws://localhost:8080/graphql/ws",
  masterAddress:
    process.env.NEXT_PUBLIC_ADMIN_ADDRESS || "0x6162896d1d7ab204c7ccac6dd5f8e9e7c25ecd5ae4fcb4ad32e57786bb46e03",
  masterPrivateKey:
    process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY || "0x1800000000300000180000000000030000000000003006001800006600",
  accountClassHash:
    process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH || "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
  manifest: manifestDev,
  predeployedAccounts: [
    {
      name: "Deployer",
      address: "0x6162896d1d7ab204c7ccac6dd5f8e9e7c25ecd5ae4fcb4ad32e57786bb46e03",
      privateKey: "0x1800000000300000180000000000030000000000003006001800006600",
      active: false,
    },
    {
      name: "Treasury",
      address: "0xe29882a1fcba1e7e10cad46212257fea5c752a4f9b1b1ec683c503a2cf5c8a",
      privateKey: "0x14d6672dcb4b77ca36a887e9a11cd9d637d5012468175829e9c6e770c61642",
      active: false,
    },
    {
      name: "Acc 3",
      address: "0x29873c310fbefde666dc32a1554fea6bb45eecc84f680f8a2b0a8fbb8cb89af",
      privateKey: "0xc5b2fcab997346f3ea1c00b002ecf6f382c5f9c9659a3894eb783c5320f912",
      active: false,
    },
  ],
};

const katanaSlot420: DojoChainConfig = {
  name: "SLOT 420",
  chainConfig: katanaSlot420Chain,
  rpcUrl: "https://us-east.api.cartridge.gg/x/ryo420/katana",
  toriiUrl: "https://api.cartridge.gg/x/ryo420/torii/graphql",
  toriiWsUrl: "wss://api.cartridge.gg/x/ryo420/torii/graphql/ws",
  masterAddress: "0x795abc2a2d5866f75c58025741329973db20966d1add5dd2a9fbdf0bb8a0266",
  masterPrivateKey: "0x2e8ac99614186737cefc47effe03134f5a19c6dc2443c16510d3384769f9c78",
  accountClassHash: "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
  manifest: manifestRyo420,
  predeployedAccounts: [
    {
      name: "Deployer",
      address: "0x2ea5a09a95ee73556a3ef6420c11a8df775fe4f06e58fd9f7a21b5d99e0b5ea",
      privateKey: "0x18055e629284db77daa8d60e4ca767d65807c3f1690785006e46d6e63a13d54",
      active: false,
    },
  ],
};

const katanaSlot421: DojoChainConfig = {
  name: "SLOT 421",
  chainConfig: katanaSlot421Chain,
  rpcUrl: "https://api.cartridge.gg/x/ryo421/katana",
  toriiUrl: "https://api.cartridge.gg/x/ryo421/torii/graphql",
  toriiWsUrl: "wss://api.cartridge.gg/x/ryo421/torii/graphql/ws",
  masterAddress: "0x7baae2348f94122027a90480a0724da3710533145738177dbe79f6f8f606eaf",
  masterPrivateKey: "0x5b59606be97709903b509a13666b194f23849c7243c074b26b826405bec2eb0",
  accountClassHash: "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
  manifest: manifestRyo421,
  predeployedAccounts: [
    {
      name: "Deployer",
      address: "0x7d806fc9478c73c60fac37c27888771bdb3092c21eb93452277e7673954d034",
      privateKey: "0x784b1dd14d761c414c6394fccca3ca1d1b0cac187e88122e4b06378f9e8c515",
      active: false,
    },
  ],
};

const snSepolia: DojoChainConfig = {
  name: "SEPOLIA",
  chainConfig: sepolia,
  rpcUrl: "https://api.cartridge.gg/rpc/starknet-sepolia/v0_7",
  // toriiUrl: "https://api.cartridge.gg/x/ryosepolia/torii/graphql",
  // toriiWsUrl: "wss://api.cartridge.gg/x/ryosepolia/torii/graphql/ws",
  toriiUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8080/graphql",
  toriiWsUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_WS || "ws://localhost:8080/graphql/ws",
  masterAddress: undefined,
  masterPrivateKey: undefined,
  accountClassHash: undefined,
  manifest: manifestRyoSepolia,
  predeployedAccounts: [],
};

const snMainnet: DojoChainConfig = {
  name: "MAINNET",
  chainConfig: mainnet,
  rpcUrl: undefined,
  toriiUrl: "https://api.cartridge.gg/x/ryo/torii/graphql",
  toriiWsUrl: "wss://api.cartridge.gg/x/ryo/torii/graphql/ws",
  masterAddress: undefined,
  masterPrivateKey: undefined,
  accountClassHash: undefined,
  manifest: manifestDev, // TODO
  predeployedAccounts: [],
};

// keys must match chain.id
export const dojoContextConfig = {
  KATANA: katanaLocal,
  // KATANA_SLOT_420: katanaSlot420,
  "KATANA_SLOT_421": katanaSlot421,
  // "SN_SEPOLIA": snSepolia,
  // "SN_MAIN": snMainnet,
};

export const dojoChains = [
  katanaLocal,
  // katanaSlot420,
  katanaSlot421,
  // snSepolia,
  // snMainnet,
];

export const getStarknetProviderChains = (): Chain[] => {
  return Object.keys(dojoContextConfig).map((key) => {
    return dojoContextConfig[key as SupportedChainIds].chainConfig;
  });
};
