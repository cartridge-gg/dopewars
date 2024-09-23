import { DojoChainConfig, getStarknetProviderChains } from "@/dojo/setup/config";
import { Chain } from "@starknet-react/chains";
import {
  ChainProviderFactory,
  ExplorerFactory,
  InjectedConnector,
  JsonRpcProviderArgs,
  StarknetConfig,
  argent,
  braavos,
  injected,
  jsonRpcProvider,
  starknetChainId,
  starkscan,
  useInjectedConnectors,
  useNetwork,
} from "@starknet-react/core";
import { ReactNode, useState } from "react";
import { RpcProvider, shortString } from "starknet";
import CartridgeConnector from "@cartridge/connector";

export const walletInstallLinks = {
  argentX: "https://www.argent.xyz/argent-x/",
  braavos: "https://braavos.app/download-braavos-wallet/",
};
export type walletInstallLinksKeys = keyof typeof walletInstallLinks;

function rpc(chain: Chain) {
  return {
    nodeUrl: chain.rpcUrls.default.http[0],
  };
}

export function customJsonRpcProvider(selectedChain: DojoChainConfig): ChainProviderFactory<RpcProvider> {
  return function (chain) {
    // if(!selectedChain) return undefined

    const config = {
      nodeUrl: selectedChain.rpcUrl || "",
    };
    // if (!config) return null;
    const chainId = selectedChain.chainConfig.id || undefined;

    ///@ts-ignore
    const provider = new RpcProvider({ ...selectedChain, ...config, chainId });

    return provider;
  };
}

import manifestRyoSepolia from "../../manifests/ryosepolia/manifest.json";
import manifestRyo1 from "../../manifests/ryo1/manifest.json";
import manifestDev from "../../manifests/dev/manifest.json";

function getConnectorsForChain(selectedChain: DojoChainConfig) {
  // console.log(selectedChain.name)
  switch (selectedChain.name) {
    case "SEPOLIA":
      return [
        cartridgeConnector({ rpc: "https://api.cartridge.gg/x/ryosepolia/katana", manifest: manifestRyoSepolia }),
      ];
      break;

    case "SLOT 1":
      return [cartridgeConnector({ rpc: "https://api.cartridge.gg/x/ryo1/katana", manifest: manifestRyo1 })];
      break;

    default:
      return [
        cartridgeConnector({ rpc: "https://localhost:5050", manifest: manifestDev }),
        injected({ id: "dojoburner" }),
      ];
      break;
  }
}

export function StarknetProvider({ children, selectedChain }: { children: ReactNode; selectedChain: DojoChainConfig }) {
  // const { connectors } = useInjectedConnectors({
  //   // Show these connectors if the user has no connector installed.
  //   recommended: [/*argent(), braavos(),*/ injected({ id: "dojoburner" }), cartridgeConnector],
  //   // Hide recommended connectors if the user has any connector installed.
  //   includeRecommended: "onlyIfNoConnectors",
  //   // Randomize the order of the connectors.
  //   // order: "random"
  // });

  const chains = getStarknetProviderChains();

  const connectors = getConnectorsForChain(selectedChain);

  // TODO: remove
  // const provider = jsonRpcProvider({ rpc });
  const provider = customJsonRpcProvider(selectedChain);

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}

const cartridgeConnector = ({ keychain, rpc, manifest }: { keychain?: string; rpc: string; manifest: any }) =>
  new CartridgeConnector({
    url: keychain ? keychain : "https://x.cartridge.gg",
    rpc,
    theme: "dope-wars",
    paymaster: {
      caller: shortString.encodeShortString("ANY_CALLER"),
    },
    policies: [
      {
        target: manifest.contracts.find((c: any) => c.tag === "dopewars-paper_mock")!.address,
        method: "faucet",
      },
      {
        target: manifest.contracts.find((c: any) => c.tag === "dopewars-paper_mock")!.address,
        method: "approve",
      },
      {
        target: manifest.contracts.find((c: any) => c.tag === "dopewars-game")!.address,
        method: "create_game",
      },
      {
        target: manifest.contracts.find((c: any) => c.tag === "dopewars-game")!.address,
        method: "travel",
      },
      {
        target: manifest.contracts.find((c: any) => c.tag === "dopewars-game")!.address,
        method: "decide",
      },
      {
        target: manifest.contracts.find((c: any) => c.tag === "dopewars-game")!.address,
        method: "end_game",
      },
      {
        target: manifest.contracts.find((c: any) => c.tag === "dopewars-laundromat")!.address,
        method: "register_score",
      },
      {
        target: manifest.contracts.find((c: any) => c.tag === "dopewars-laundromat")!.address,
        method: "claim",
      },
    ],
  }) as unknown as InjectedConnector;
