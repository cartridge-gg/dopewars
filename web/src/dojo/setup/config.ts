import { PredeployedAccount } from "@dojoengine/create-burner";
import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import { katanaInternalChain, katanaLocalChain, katanaSlot1Chain } from "./chains";

import manifestDev from "../../manifests/dev/manifest.json";
import manifestInternal from "../../manifests/internal/manifest.json";
import manifestRyo1 from "../../manifests/ryo1/manifest.json";
import manifestRyoSepolia from "../../manifests/ryosepolia/manifest.json";
import manifestMainnet from "../../manifests/mainnet/manifest.json";

import { DW_NS } from "../hooks";

export const VRF_PROVIDER_SEPOLIA = "0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f";
export const VRF_PROVIDER_MAINNET = "0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f";

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
  vrfProviderAddress: string;
  vrfProviderSecret?: string;
};

const katanaLocal: DojoChainConfig = {
  name: "KATANA",
  chainConfig: katanaLocalChain,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT || "http://localhost:5050",
  toriiUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8080/graphql",
  toriiWsUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_WS || "ws://localhost:8080/graphql/ws",
  masterAddress:
    process.env.NEXT_PUBLIC_ADMIN_ADDRESS || "0x6b86e40118f29ebe393a75469b4d926c7a44c2e2681b6d319520b7c1156d114",
  masterPrivateKey:
    process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY || "0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b",
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
  vrfProviderAddress: manifestDev.contracts.find((i) => i.tag === `${DW_NS}-vrf_provider_mock`)?.address || "0x0",
  vrfProviderSecret: "0x420",
};

const katanaInternal: DojoChainConfig = {
  name: "INTERNAL",
  chainConfig: katanaInternalChain,
  rpcUrl: "http://localhost:8001/x/starknet/sepolia",
  toriiUrl: "http://localhost:8080/graphql",
  toriiWsUrl: "wss://localhost:8080/graphql/ws",
  masterAddress: "0x41b6dab3967eaaee4cfecdc950079aee353afd96bcf0628bf84fc64a43c3021",
  masterPrivateKey: "0x60daf368ad686f192614eb8785e50ab3cd6168d3243a00e3e864576ac66b650",
  accountClassHash: "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
  manifest: manifestInternal,
  predeployedAccounts: [
    {
      name: "Deployer",
      address: "0x41b6dab3967eaaee4cfecdc950079aee353afd96bcf0628bf84fc64a43c3021",
      privateKey: "0x60daf368ad686f192614eb8785e50ab3cd6168d3243a00e3e864576ac66b650",
      active: false,
    },
  ],
  vrfProviderAddress: manifestDev.contracts.find((i) => i.tag === `${DW_NS}-vrf_provider_mock`)?.address || "0x0",
  vrfProviderSecret: "0x420",
};

const katanaSlot1: DojoChainConfig = {
  name: "SLOT 1",
  chainConfig: katanaSlot1Chain,
  rpcUrl: "https://api.cartridge.gg/x/ryo1/katana",
  toriiUrl: "https://api.cartridge.gg/x/ryo1/torii/graphql",
  toriiWsUrl: "wss://api.cartridge.gg/x/ryo1/torii/graphql/ws",
  masterAddress: undefined,
  masterPrivateKey: undefined,
  accountClassHash: undefined,
  manifest: manifestRyo1,
  predeployedAccounts: [],
  vrfProviderAddress: manifestDev.contracts.find((i) => i.tag === `${DW_NS}-vrf_provider_mock`)?.address || "0x0",
  vrfProviderSecret: undefined,
};

const snSepolia: DojoChainConfig = {
  name: "SEPOLIA",
  chainConfig: sepolia,
  // rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia/rpc/v0_7",
  rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  toriiUrl: "https://api.cartridge.gg/x/ryosepolia2/torii/graphql",
  toriiWsUrl: "wss://api.cartridge.gg/x/ryosepolia2/torii/graphql/ws",
  masterAddress: undefined,
  masterPrivateKey: undefined,
  accountClassHash: undefined,
  manifest: manifestRyoSepolia,
  predeployedAccounts: [],
  vrfProviderAddress: VRF_PROVIDER_SEPOLIA,
  vrfProviderSecret: undefined,
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
  manifest: manifestMainnet,
  predeployedAccounts: [],
  vrfProviderAddress: VRF_PROVIDER_MAINNET,
  vrfProviderSecret: undefined,
};

// keys must match chain.id
export const dojoContextConfig = {
  KATANA: katanaLocal,
  // INTERNAL: katanaInternal,
  // KATANA_SLOT_420: katanaSlot420,
  // KATANA_SLOT_421: katanaSlot421,
  // WP_RYO1: katanaSlot1,
  SN_SEPOLIA: snSepolia,
  // "SN_MAIN": snMainnet,
};

export const dojoChains = [
  katanaLocal,
  // katanaInternal,
  // katanaSlot420,
  // katanaSlot421,
  // katanaSlot1,
  snSepolia,
  // snMainnet,
];

export const getStarknetProviderChains = (): Chain[] => {
  return Object.keys(dojoContextConfig).map((key) => {
    return dojoContextConfig[key as SupportedChainIds].chainConfig;
  });
};
