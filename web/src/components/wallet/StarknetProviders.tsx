import { dojoChains } from "@/dojo/setup/config";
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

export function StarknetProviders({ children }: { children: ReactNode }) {

  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [ injected({id:"dojoburner"}) ,argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "always",
    // Randomize the order of the connectors.
    // order: "random"
  });

  // const connectors = isKatana ? [...listConnectors()] : [argent(), braavos()];

  // TODO: remove
  const provider = jsonRpcProvider({ rpc });

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig
      chains={dojoChains}
      provider={provider}
      connectors={connectors}
      explorer={explorer}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
