import { getStarknetProviderChains } from "@/dojo/setup/config";
import { Chain } from "@starknet-react/chains";
import {
  ExplorerFactory,
  InjectedConnector,
  StarknetConfig,
  // argent,
  // braavos,
  // injected,
  jsonRpcProvider,
  starkscan,
  // useInjectedConnectors,
} from "@starknet-react/core";
import { ReactNode, useState } from "react";
import CartridgeConnector from "@cartridge/connector"
import colors from "@/theme/colors";

export const walletInstallLinks = {
  argentX: "https://www.argent.xyz/argent-x/",
  braavos: "https://braavos.app/download-braavos-wallet/",
};
export type walletInstallLinksKeys = keyof typeof walletInstallLinks;

function rpc(chain: Chain) {
  //console.log(chain)
  return {
    nodeUrl: chain.rpcUrls.default.http[0],
  };
}

export function StarknetProvider({ children }: { children: ReactNode }) {
  const chains = getStarknetProviderChains();
  // const connectors = isKatana ? [...listConnectors()] : [argent(), braavos()];

  // TODO: remove
  const provider = jsonRpcProvider({ rpc });

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={[cartridgeConnector]} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}

const cartridgeConnector = new CartridgeConnector(
  [
    // TODO: Set Policies
    // {
    //   target: "0x...",
    //   method: "todo",
    // },
  ],
  {
    url: "https://x.cartridge.gg",
    theme: {
      colors: {
        // e.g. button bg
        primary: colors.neon["200"] as string,
      }
    },
  }
) as unknown as InjectedConnector
