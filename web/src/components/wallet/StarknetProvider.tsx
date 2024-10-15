import { DojoChainConfig, getStarknetProviderChains, VRF_PROVIDER_SEPOLIA } from "@/dojo/setup/config";
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

function getConnectorsForChain(selectedChain: DojoChainConfig) {
  const controller = cartridgeConnector({ rpc: selectedChain.rpcUrl, manifest: selectedChain.manifest });

  switch (selectedChain.name) {
    case "KATANA":
      return [controller, injected({ id: "dojoburner" })];
      break;

    case "INTERNAL":
      return [
        cartridgeConnector({
          keychain: "http://localhost:3001",
          rpc: selectedChain.rpcUrl,
          manifest: selectedChain.manifest,
        }),
        // injected({ id: "dojoburner" }),
      ];
      break;

    default:
      return [controller];
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

const cartridgeConnector = ({ keychain, rpc, manifest }: { keychain?: string; rpc?: string; manifest: any }) => {
  return new CartridgeConnector({
    url: keychain ? keychain : "https://x.cartridge.gg",
    rpc: rpc ? rpc : "http://localhost:5050",
    theme: "dope-wars",
    paymaster: {
      caller: shortString.encodeShortString("ANY_CALLER"),
    },
    policies: [
      {
        target: VRF_PROVIDER_SEPOLIA,
        method: "request_random",
      },
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
      //
    
      {
        target: manifest.contracts.find((c: any) => c.tag === "dopewars-predictoor")!.address,
        method: "predictoor",
      },
    ],
  }) as unknown as InjectedConnector;
};
