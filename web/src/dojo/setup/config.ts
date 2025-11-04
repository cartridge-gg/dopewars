import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import { katanaLocalChain, katanaSlotDopewarsChain } from "./chains";

import manifestDev from "../../manifests/manifest_dev.json";
import manifestDopewars from "../../manifests/manifest_dopewars.json";
import manifestMainnet from "../../manifests/manifest_mainnet.json";
import manifestSepolia from "../../manifests/manifest_sepolia.json";

import manifestDopeDev from "../../manifests_dope/manifest_dev.json";
import manifestDopeSepolia from "../../manifests_dope/manifest_sepolia.json";
// import manifestDopeDope from "../../manifests_dope/manifest_dope.json";

import {
  default as manifestDopeDopewars,
} from "../../manifests_dope/manifest_dopewars.json";

import {
  default as manifestDopeMainnet,
} from "../../manifests_dope/manifest_mainnet.json";

// import {
//   manifestDev as manifestDopeDev,
//   manifestDope as manifestDopeDope,
//   manifestDopewars as manifestDopeDopewars,
//   manifestSepolia as manifestDopeSepolia,
//   manifestMainnet as manifestDopeMainnet,
// } from "@/dope/manifests";

import { mergeManifests } from "@/dope/helpers";
import { DW_NS } from "../constants";

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
  manifest: mergeManifests(manifestDev, [manifestDopeDev]),
  paperAddress: manifestDev.contracts.find((i) => i.tag === `${DW_NS}-paper_mock`)?.address || "0x0",
  vrfProviderAddress: manifestDev.contracts.find((i) => i.tag === `${DW_NS}-vrf_provider_mock`)?.address || "0x0",
  vrfProviderSecret: "0x420",
  namespace: DW_NS,
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
  paperAddress: manifestDopewars.contracts.find((i) => i.tag === `${DW_NS}-paper_mock`)?.address || "0x0",
  vrfProviderAddress: manifestDopewars.contracts.find((i) => i.tag === `${DW_NS}-vrf_provider_mock`)?.address || "0x0",
  vrfProviderSecret: "0x420",
  namespace: DW_NS,
};

const snSepolia: DojoChainConfig = {
  name: "SEPOLIA",
  chainConfig: sepolia,
  rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  toriiUrl: "https://api.cartridge.gg/x/ryosepolia2/torii/graphql",
  toriiWsUrl: "wss://api.cartridge.gg/x/ryosepolia2/torii/graphql/ws",
  manifest: mergeManifests(manifestSepolia, [manifestDopeSepolia]),
  slot: "ryosepolia2",
  paperAddress: manifestSepolia.contracts.find((i) => i.tag === `${DW_NS}-paper_mock`)?.address || "0x0",
  vrfProviderAddress: VRF_PROVIDER_SEPOLIA,
  vrfProviderSecret: undefined,
  namespace: DW_NS,
};

const snMainnet: DojoChainConfig = {
  name: "MAINNET",
  chainConfig: mainnet,
  rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet",
  toriiUrl: "https://api.cartridge.gg/x/ryomainnet3/torii/graphql",
  toriiWsUrl: "wss://api.cartridge.gg/x/ryomainnet3/torii/graphql/ws",
  manifest: mergeManifests(manifestMainnet, [manifestDopeMainnet]),
  slot: "ryomainnet3",
  paperAddress: PAPER_MAINNET,
  vrfProviderAddress: VRF_PROVIDER_MAINNET,
  vrfProviderSecret: undefined,
  namespace: DW_NS,
};

// keys must match chain.id
export const dojoContextConfig = {
  SN_MAIN: snMainnet,
  // KATANA: katanaLocal,
  // SN_SEPOLIA: snSepolia,
  // WP_DOPEWARS: katanaSlotDopewars,
};

export const dojoChains = Object.values(dojoContextConfig);

export const getStarknetProviderChains = (): Chain[] => {
  return Object.keys(dojoContextConfig).map((key) => {
    return dojoContextConfig[key as SupportedChainIds].chainConfig;
  });
};
