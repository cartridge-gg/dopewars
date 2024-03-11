import { useDojoContext } from "@/dojo/hooks";
import { Chain } from "@starknet-react/chains";
import {
  ExplorerFactory,
  StarknetConfig,
  argent,
  braavos,
  jsonRpcProvider,
  starkscan,
  useInjectedConnectors,
} from "@starknet-react/core";
import { ReactNode, useEffect, useState } from "react";

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
  const {
    burner: { listConnectors },
    network: { chains, selectedChain, isKatana },
  } = useDojoContext();

  //const provider = publicProvider();
  const [recommended, setRecommanded] = useState([]);

  useEffect(() => {
    if (isKatana) {
      setRecommanded(listConnectors());
    } else {
      setRecommanded([argent(), braavos()]);
    }
  }, [isKatana]);

  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended,
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "always",
    // Randomize the order of the connectors.
    // order: "random"
  });

  // console.log("StarknetProviders");
  // console.log(recommended)
  // console.log(connectors)

  // TODO: remove
  const provider = jsonRpcProvider({ rpc });

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}
