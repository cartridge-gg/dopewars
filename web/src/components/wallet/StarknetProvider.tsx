import { DojoChainConfig, getStarknetProviderChains } from "@/dojo/setup/config";
import { Chain } from "@starknet-react/chains";
import {
  ChainProviderFactory,
  ExplorerFactory,
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
import { RpcProvider } from "starknet";

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
      nodeUrl: selectedChain.rpcUrl || ""
    } 
    // if (!config) return null;
    const chainId = selectedChain.chainConfig.id || undefined

    ///@ts-ignore
    const provider = new RpcProvider({ ...selectedChain, ...config, chainId });

    return provider;
  };
}

export function StarknetProvider({ children, selectedChain }: { children: ReactNode; selectedChain: DojoChainConfig }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos(), injected({ id: "dojoburner" })],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "always",
    // Randomize the order of the connectors.
    // order: "random"
  });

  const chains = getStarknetProviderChains();
  // const connectors = isKatana ? [...listConnectors()] : [argent(), braavos()];

  // TODO: remove
  // const provider = jsonRpcProvider({ rpc });
  const provider = customJsonRpcProvider(selectedChain)

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}
