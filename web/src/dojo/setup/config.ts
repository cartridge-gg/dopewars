import { PredeployedAccount } from "@dojoengine/create-burner";
import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import { katanaLocalChain, katanaSlotDopewarsChain } from "./chains";

import manifestDev from "../../manifests/manifest_dev.json";
import manifestDopewars from "../../manifests/manifest_dopewars.json";
import manifestMainnet from "../../manifests/manifest_mainnet.json";
import manifestRyoSepolia from "../../manifests/manifest_ryosepolia.json";


import manifestDopeDev from "../../manifests_dope/manifest_dev.json";
// import manifestDopeDope from "../../manifests_dope/manifest_dope.json";

import { default as manifestDopeDopewars, default as manifestDopeMainnet, default as manifestDopeSepolia } from "../../manifests_dope/manifest_dopewars.json";
// import {
//   manifestDev as manifestDopeDev,
//   manifestDope as manifestDopeDope,
//   manifestDopewars as manifestDopeDopewars,
//   manifestSepolia as manifestDopeSepolia,
//   manifestMainnet as manifestDopeMainnet,
// } from "@/dope/manifests";

import { mergeManifests } from "@/dope/helpers";
import { DW_NS } from "../hooks";

const VRF_PROVIDER_SEPOLIA = "0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f";
const VRF_PROVIDER_MAINNET = "0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f";
const PAPER_MAINNET = "0x410466536b5ae074f7fea81e5533b8134a9fa08b3dd077dd9db08f64997d113";

export type SupportedChainIds = keyof typeof dojoContextConfig;
export type DojoContextConfig = typeof dojoContextConfig;

export type DojoChainConfig = {
  name: string;
  chainConfig: Chain;
  rpcUrl?: string;
  toriiUrl: string;
  toriiWsUrl: string;
  keychain?: string;
  profileUrl?: string;
  masterAddress?: string;
  masterPrivateKey?: string;
  accountClassHash?: string;
  predeployedAccounts: PredeployedAccount[];
  manifest: any;
  namespace?: string;
  slot?: string;
  paperAddress: string;
  vrfProviderAddress: string;
  vrfProviderSecret?: string;
};


const katanaLocal: DojoChainConfig = {
  name: "KATANA",
  chainConfig: katanaLocalChain,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT || "http://localhost:5050",
  toriiUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "https://localhost:8080/graphql",
  toriiWsUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_WS || "wss://localhost:8080/graphql/ws",
  masterAddress:
    process.env.NEXT_PUBLIC_ADMIN_ADDRESS || "0x2af9427c5a277474c079a1283c880ee8a6f0f8fbf73ce969c08d88befec1bba",
  masterPrivateKey:
    process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY || "0x1800000000300000180000000000030000000000003006001800006600",
  accountClassHash:
    process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH || "0x07dc7899aa655b0aae51eadff6d801a58e97dd99cf4666ee59e704249e51adf2",
  manifest: mergeManifests(manifestDev, [manifestDopeDev]),
  predeployedAccounts: [
    {
      name: "Deployer",
      address: "0x127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec",
      privateKey: "0xc5b2fcab997346f3ea1c00b002ecf6f382c5f9c9659a3894eb783c5320f912",
      active: false,
    },
    {
      name: "Treasury",
      address: "0x13d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
      privateKey: "0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b",
      active: false,
    },
    {
      name: "Acc 3",
      address: "0x17cc6ca902ed4e8baa8463a7009ff18cc294fa85a94b4ce6ac30a9ebd6057c7",
      privateKey: "0x14d6672dcb4b77ca36a887e9a11cd9d637d5012468175829e9c6e770c61642",
      active: false,
    },
  ],
  paperAddress: manifestDev.contracts.find((i) => i.tag === `${DW_NS}-paper_mock`)?.address || "0x0",
  vrfProviderAddress: manifestDev.contracts.find((i) => i.tag === `${DW_NS}-vrf_provider_mock`)?.address || "0x0",
  vrfProviderSecret: "0x420",
};

const katanaSlotDopewars: DojoChainConfig = {
  name: "WP_DOPEWARS",
  chainConfig: katanaSlotDopewarsChain,
  rpcUrl: "https://api.cartridge.gg/x/dopewars/katana",
  toriiUrl: "https://api.cartridge.gg/x/dopewars/torii/graphql",
  toriiWsUrl: "wss://api.cartridge.gg/x/dopewars/torii/graphql/ws",
  manifest: mergeManifests(manifestDopewars, [manifestDopeDopewars]),
  slot: "dopewars",
  profileUrl: "https://profile.cartridge.gg",
  predeployedAccounts: [],
  paperAddress: manifestDopewars.contracts.find((i) => i.tag === `${DW_NS}-paper_mock`)?.address || "0x0",
  vrfProviderAddress: manifestDopewars.contracts.find((i) => i.tag === `${DW_NS}-vrf_provider_mock`)?.address || "0x0",
  vrfProviderSecret: "0x420",
};


const snSepolia: DojoChainConfig = {
  name: "SEPOLIA",
  chainConfig: sepolia,
  rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  toriiUrl: "https://api.cartridge.gg/x/ryosepolia2/torii/graphql",
  toriiWsUrl: "wss://api.cartridge.gg/x/ryosepolia2/torii/graphql/ws",
  manifest: mergeManifests(manifestRyoSepolia, [manifestDopeSepolia]),
  slot: "ryosepolia2",
  predeployedAccounts: [],
  paperAddress: manifestRyoSepolia.contracts.find((i) => i.tag === `${DW_NS}-paper_mock`)?.address || "0x0",
  vrfProviderAddress: VRF_PROVIDER_SEPOLIA,
  vrfProviderSecret: undefined,
};

const snMainnet: DojoChainConfig = {
  name: "MAINNET",
  chainConfig: mainnet,
  rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet",
  toriiUrl: "https://api.cartridge.gg/x/ryomainnet/torii/graphql",
  toriiWsUrl: "wss://api.cartridge.gg/x/ryomainnet/torii/graphql/ws",
  manifest: mergeManifests(manifestMainnet, [manifestDopeMainnet]),
  slot: "ryomainnet",
  predeployedAccounts: [],
  paperAddress: PAPER_MAINNET,
  vrfProviderAddress: VRF_PROVIDER_MAINNET,
  vrfProviderSecret: undefined,
};

// keys must match chain.id
export const dojoContextConfig = {
  // SN_MAIN: snMainnet,
  // SN_SEPOLIA: snSepolia,
  WP_DOPEWARS: katanaSlotDopewars,
  KATANA: katanaLocal,
};

export const dojoChains = Object.values(dojoContextConfig);

export const getStarknetProviderChains = (): Chain[] => {
  return Object.keys(dojoContextConfig).map((key) => {
    return dojoContextConfig[key as SupportedChainIds].chainConfig;
  });
};
