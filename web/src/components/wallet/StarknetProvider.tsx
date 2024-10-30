import { DojoChainConfig, getStarknetProviderChains } from "@/dojo/setup/config";
import {
  ChainProviderFactory,
  ExplorerFactory,
  InjectedConnector,
  StarknetConfig,
  injected,
  starkscan,
} from "@starknet-react/core";
import { ReactNode, useState } from "react";
import { RpcProvider, shortString } from "starknet";
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
    const provider = new RpcProvider({ ...selectedChain, ...config, chainId });

    return provider;
  };
}

function getConnectorsForChain(selectedChain: DojoChainConfig) {
  const controller = cartridgeConnector({ selectedChain });

  switch (selectedChain.name) {
    case "KATANA":
      return [controller, injected({ id: "dojoburner" }), injected({ id: "dojopredeployed" })];

    case "INTERNAL":
      return [
        cartridgeConnector({
          keychain: "http://localhost:3001",
          selectedChain,
        }),
        injected({ id: "dojoburner" }),
      ];

    default:
      return [controller];
  }
}

export function StarknetProvider({ children, selectedChain }: { children: ReactNode; selectedChain: DojoChainConfig }) {
  const chains = getStarknetProviderChains();
  const connectors = getConnectorsForChain(selectedChain);
  const provider = customJsonRpcProvider(selectedChain);

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}

const cartridgeConnector = ({ keychain, selectedChain }: { keychain?: string; selectedChain: DojoChainConfig }) => {
  // TODO handle mainnet
  const paperAddress = getContractByName(selectedChain.manifest, DW_NS, "paper_mock").address;
  const gameAddress = getContractByName(selectedChain.manifest, DW_NS, "game").address;
  const laundromatAddress = getContractByName(selectedChain.manifest, DW_NS, "laundromat").address;
  // const slotmachineAddress = getContractByName(selectedChain.manifest, DW_NS, "slotmachine").address;

  return new ControllerConnector({
    url: keychain ? keychain : "https://x.cartridge.gg",
    rpc: selectedChain.rpcUrl ? selectedChain.rpcUrl : "http://localhost:5050",
    theme: "dope-wars",
    // paymaster: {
    //   caller: shortString.encodeShortString("ANY_CALLER"),
    // },
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
      //
      // {
      //   target: slotmachineAddress,
      //   method: "roll",
      // },
    ],
  }) as unknown as InjectedConnector;
};
