import { getStarknetProviderChains } from "@/dojo/setup/config";
import { Chain } from "@starknet-react/chains";
import {
  ExplorerFactory,
  StarknetConfig,
  argent,
  braavos,
  injected,
  jsonRpcProvider,
  starkscan,
  useInjectedConnectors,
} from "@starknet-react/core";
import { ReactNode, useState } from "react";

export const walletInstallLinks = {
  argentX: "https://www.argent.xyz/argent-x/",
  braavos: "https://braavos.app/download-braavos-wallet/",
};
export type walletInstallLinksKeys = keyof typeof walletInstallLinks;

function rpc(chain: Chain) {
  return {
    nodeUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT,
  };
}

export function StarknetProvider({ children }: { children: ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos(), injected({id:'dojoburner'})],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "always",
    // Randomize the order of the connectors.
    // order: "random"
  });

  const chains = getStarknetProviderChains();
  // const connectors = isKatana ? [...listConnectors()] : [argent(), braavos()];

  // TODO: remove
  const provider = jsonRpcProvider({ rpc });

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}
