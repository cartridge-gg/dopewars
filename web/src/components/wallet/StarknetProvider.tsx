import { DojoChainConfig, getStarknetProviderChains } from "@/dojo/setup/config";
import { Chain } from "@starknet-react/chains";
import {
  ChainProviderFactory,
  ExplorerFactory,
  InjectedConnector,
  StarknetConfig,
  // argent,
  // braavos,
  // injected,
  jsonRpcProvider,
  starknetChainId,
  starkscan,
  useInjectedConnectors,
} from "@starknet-react/core";
import { ReactNode, useState } from "react";
import CartridgeConnector from "@cartridge/connector"
import colors from "@/theme/colors";
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
  const chains = getStarknetProviderChains();
  // const connectors = isKatana ? [...listConnectors()] : [argent(), braavos()];

  // TODO: remove
  // const provider = jsonRpcProvider({ rpc });
  const provider = customJsonRpcProvider(selectedChain)

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={[cartridgeConnector]} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}

const actionContractAddr = process.env.ACTION_CONTRACT_ADDRESS as string;

const cartridgeConnector = new CartridgeConnector(
  [
    {
      target: actionContractAddr,
      method: "create_game"
    },
    {
      target: actionContractAddr,
      method: "end_game"
    },
    {
      target: actionContractAddr,
      method: "travel"
    },
    {
      target: actionContractAddr,
      method: "decide"
    }
  ],
  {
    url: "https://x.cartridge.gg",
    theme: "rollyourown",
  }
) as unknown as InjectedConnector
