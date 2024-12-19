import { DojoChainConfig, getStarknetProviderChains } from "@/dojo/setup/config";
import {
  ChainProviderFactory,
  ExplorerFactory,
  InjectedConnector,
  StarknetConfig,
  argent,
  injected,
  starkscan,
} from "@starknet-react/core";
import { ReactNode, useMemo, useState } from "react";
import { RpcProvider } from "starknet";
import { getContractByName } from "@dojoengine/core";
import { DW_NS } from "@/dojo/hooks";
import { ControllerConnector } from "@cartridge/connector";
import { useRouter } from "next/router";

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

function getConnectorsForChain(selectedChain: DojoChainConfig, path: string) {
  const controller = cartridgeConnector({ selectedChain });



  switch (selectedChain.name) {
    case "KATANA":
      return [injected({ id: "dojoburner" }), injected({ id: "dojopredeployed" })];

    // case "SN_SEPOLIA":
    //   return [cartridgeConnector({ selectedChain })];

    case "WP_RYO1":
    case "WP_RYO2":
      return [
        controller,
        // injected({ id: "dojoburner" }),
        // injected({ id: "dojopredeployed" }),
        // cartridgeConnector({ selectedChain }),
      ];

    default:
      // const controller = cartridgeConnector({ selectedChain });
      if (path.startsWith("/admin")) {
        return [controller, argent()];
      }
      return [controller];
  }
}

export function StarknetProvider({ children, selectedChain }: { children: ReactNode; selectedChain: DojoChainConfig }) {
  const router = useRouter();
  const chains = getStarknetProviderChains();

  const provider = useMemo(() => {
    return customJsonRpcProvider(selectedChain);
  }, [selectedChain]);

  const connectors = useMemo(() => {
    return getConnectorsForChain(selectedChain, router.asPath);
  }, [selectedChain]);

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}

const cartridgeConnector = ({ selectedChain }: { selectedChain: DojoChainConfig }) => {
  // console.log("cartridgeConnector", selectedChain.name);
  const paperAddress = selectedChain.paperAddress;
  const gameAddress = getContractByName(selectedChain.manifest, DW_NS, "game").address;
  const laundromatAddress = getContractByName(selectedChain.manifest, DW_NS, "laundromat").address;

  const policies = [
    {
      target: selectedChain.vrfProviderAddress,
      method: "request_random",
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
    {
      target: laundromatAddress,
      method: "launder",
    },
  ];

  if (selectedChain.name !== "MAINNET") {
    policies.push({
      target: paperAddress,
      method: "faucet",
    });

    policies.push({
      target: selectedChain.vrfProviderAddress,
      method: "submit_random",
    });

    policies.push({
      target: selectedChain.vrfProviderAddress,
      method: "assert_consumed",
    });
  }

  // console.log(policies);

  return new ControllerConnector({
    url: selectedChain.keychain ? selectedChain.keychain : "https://x.cartridge.gg",
    rpc: selectedChain.rpcUrl ? selectedChain.rpcUrl : "http://localhost:5050",
    profileUrl: selectedChain.profileUrl ? selectedChain.profileUrl : undefined,
    namespace: selectedChain.namespace ? selectedChain.namespace : "dopewars",
    slot: selectedChain.slot ? selectedChain.slot : "ryo",
    tokens: {
      erc20: [
        // paperAddress
        "0x410466536b5ae074f7fea81e5533b8134a9fa08b3dd077dd9db08f64997d113",
      ],
    },
    preset: "dope-wars",
    colorMode: "dark",
    policies: selectedChain.name === "MAINNET" ? undefined : policies,
  }) as unknown as InjectedConnector;
};
