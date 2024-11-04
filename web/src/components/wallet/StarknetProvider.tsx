import { DojoChainConfig, getStarknetProviderChains } from "@/dojo/setup/config";
import {
  ChainProviderFactory,
  ExplorerFactory,
  InjectedConnector,
  StarknetConfig,
  injected,
  starkscan,
} from "@starknet-react/core";
import { ReactNode, useMemo, useState } from "react";
import { RpcProvider } from "starknet";
import { getContractByName } from "@dojoengine/core";
import { DW_NS } from "@/dojo/hooks";
import { ControllerConnector } from "@cartridge/connector";

export const walletInstallLinks = {
  argentX: "https://www.argent.xyz/argent-x/",
  braavos: "https://braavos.app/download-braavos-wallet/",
};
export type walletInstallLinksKeys = keyof typeof walletInstallLinks;

export function customJsonRpcProvider(selectedChain: DojoChainConfig): ChainProviderFactory<RpcProvider> {
  return function (chain) {
    const config = {
      nodeUrl: selectedChain.rpcUrl || "",
    };
    const chainId = selectedChain.chainConfig.id || undefined;

    ///@ts-ignore
    const provider = new RpcProvider({ ...config, chainId });

    return provider;
  };
}

function getConnectorsForChain(selectedChain: DojoChainConfig) {
  switch (selectedChain.name) {
    case "KATANA":
      return [injected({ id: "dojoburner" }), injected({ id: "dojopredeployed" })];

    case "WP_RYO1":
      return [
        injected({ id: "dojoburner" }),
        injected({ id: "dojopredeployed" }),
        cartridgeConnector({ selectedChain }),
      ];

    default:
      const controller = cartridgeConnector({ selectedChain });
      return [controller];
  }
}

export function StarknetProvider({ children, selectedChain }: { children: ReactNode; selectedChain: DojoChainConfig }) {
  const chains = getStarknetProviderChains();

  const provider = useMemo(() => {
    return customJsonRpcProvider(selectedChain);
  }, [selectedChain]);

  const connectors = useMemo(() => {
    return getConnectorsForChain(selectedChain);
  }, [selectedChain]);

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}

const cartridgeConnector = ({ keychain, selectedChain }: { keychain?: string; selectedChain: DojoChainConfig }) => {
  const paperAddress = selectedChain.paperAddress;
  const gameAddress = getContractByName(selectedChain.manifest, DW_NS, "game").address;
  const laundromatAddress = getContractByName(selectedChain.manifest, DW_NS, "laundromat").address;

  return new ControllerConnector({
    url: keychain ? keychain : "https://x.cartridge.gg",
    rpc: selectedChain.rpcUrl ? selectedChain.rpcUrl : "http://localhost:5050",
    tokens: { erc20: [paperAddress] },
    theme: "dope-wars",
    policies: [
      {
        target: selectedChain.vrfProviderAddress,
        method: "request_random",
      },
      {
        target: paperAddress,
        method: "faucet",
      },
      {
        target: paperAddress,
        method: "approve",
      },
      {
        target: gameAddress,
        method: "create_game",
      },
      {
        target: gameAddress,
        method: "travel",
      },
      {
        target: gameAddress,
        method: "decide",
      },
      {
        target: gameAddress,
        method: "end_game",
      },
      {
        target: laundromatAddress,
        method: "register_score",
      },
      {
        target: laundromatAddress,
        method: "claim",
      },
    ],
  }) as unknown as InjectedConnector;
};
