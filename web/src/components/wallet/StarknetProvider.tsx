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
import { constants } from "starknet";
// import { getSocialPolicies, SocialOptions } from "@bal7hazar/arcade-sdk";

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

  const contracts = {
    [selectedChain.vrfProviderAddress]: {
      methods: [
        {
          name: "request_random",
          entrypoint: "request_random",
        },
      ],
    },
    [paperAddress]: {
      methods: [
        {
          name: "approve",
          entrypoint: "approve",
        },
      ],
    },
    [gameAddress]: {
      methods: [
        {
          name: "create_game",
          entrypoint: "create_game",
        },
        {
          name: "travel",
          entrypoint: "travel",
        },
        {
          name: "decide",
          entrypoint: "decide",
        },
        {
          name: "end_game",
          entrypoint: "end_game",
        },
      ],
    },
    [laundromatAddress]: {
      methods: [
        {
          name: "register_score",
          entrypoint: "register_score",
        },
        {
          name: "claim",
          entrypoint: "claim",
        },
        {
          name: "launder",
          entrypoint: "launder",
        },
      ],
    },
    // ...getSocialPolicies(constants.StarknetChainId.SN_MAIN, { pin: true }).contracts,
  };

  if (selectedChain.name !== "MAINNET") {
    contracts[paperAddress].methods.push({
      name: "faucet",
      entrypoint: "faucet",
      // description: "Paper faucet",
    });

    contracts[selectedChain.vrfProviderAddress].methods.push({
      name: "submit_random",
      entrypoint: "submit_random",
      // description: "VRF Submit Randomness",
    });
    contracts[selectedChain.vrfProviderAddress].methods.push({
      name: "assert_consumed",
      entrypoint: "assert_consumed",
      // description: "VRF Assert Consumed",
    });
  }

  // console.log(policies);

  return new ControllerConnector({
    chains: [{ rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" }],
    defaultChainId: constants.StarknetChainId.SN_MAIN,
    url: selectedChain.keychain ? selectedChain.keychain : "https://x.cartridge.gg",
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
    policies: selectedChain.name === "MAINNET" ? undefined : { contracts },
  }) as unknown as InjectedConnector;
};
