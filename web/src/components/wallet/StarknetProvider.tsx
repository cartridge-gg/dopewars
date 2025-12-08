import { DW_NS } from "@/dojo/constants";
import { katanaLocalChain } from "@/dojo/setup/chains";
import { DojoChainConfig, dojoContextConfig } from "@/dojo/setup/config";
import { ControllerConnector } from "@cartridge/connector";
import { SessionPolicies } from "@cartridge/presets";
import { getContractByName } from "@dojoengine/core";
import { Chain } from "@starknet-react/chains";
import {
  ChainProviderFactory,
  Connector,
  ExplorerFactory,
  InjectedConnector,
  StarknetConfig,
  argent,
  injected,
  jsonRpcProvider,
  starkscan,
} from "@starknet-react/core";
import { useRouter } from "next/router";
import { ReactNode, useMemo, useState } from "react";
import { RpcProvider } from "starknet";

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
      return [
        controller /*injected({ id: "dojoburner" }), */,
        // injected({ id: "dojopredeployed" })
      ];

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

const cartridgeConnector = ({ selectedChain }: { selectedChain: DojoChainConfig }) => {
  // console.log("cartridgeConnector", selectedChain.name);
  const paperAddress = selectedChain.paperAddress;

  const gameAddress = getContractByName(selectedChain.manifest, DW_NS, "game").address;
  const decideAddress = getContractByName(selectedChain.manifest, DW_NS, "decide").address;
  const laundromatAddress = getContractByName(selectedChain.manifest, DW_NS, "laundromat").address;
  const dopeLootClaimAddress = getContractByName(selectedChain.manifest, "dope", "DopeLootClaim").address;
  const dopeLootAddress = getContractByName(selectedChain.manifest, "dope", "DopeLoot").address;
  const dopeGearAddress = getContractByName(selectedChain.manifest, "dope", "DopeGear").address;
  const dopeHustlersAddress = getContractByName(selectedChain.manifest, "dope", "DopeHustlers").address;

  const policies: SessionPolicies = {
    contracts: {
      [selectedChain.vrfProviderAddress]: {
        methods: [{ entrypoint: "request_random" }],
      },
      [paperAddress]: {
        methods: [{ entrypoint: "approve" }],
      },
      [gameAddress]: {
        methods: [{ entrypoint: "create_game" }, { entrypoint: "travel" }, { entrypoint: "end_game" }],
      },
      [decideAddress]: {
        methods: [{ entrypoint: "decide" }],
      },
      [laundromatAddress]: {
        methods: [{ entrypoint: "register_score" }, { entrypoint: "claim" }, { entrypoint: "launder" }],
      },
      [dopeLootClaimAddress]: {
        methods: [{ entrypoint: "release" }, { entrypoint: "open" }],
      },
      [dopeGearAddress]: {
        methods: [{ entrypoint: "set_approval_for_all" }],
      },
      [dopeHustlersAddress]: {
        methods: [
          { entrypoint: "update_hustler" },
          { entrypoint: "update_hustler_body" },
          { entrypoint: "equip" },
          { entrypoint: "unequip" },
        ],
      },
      [dopeLootAddress]: {
        methods: [
          {
            entrypoint: "delegate",
          },
        ],
      },
    },
  };

  if (selectedChain.name !== "MAINNET") {
    // const devtoolsAddress = getContractByName(selectedChain.manifest, DW_NS, "devtools")?.address;

    // policies.contracts![devtoolsAddress] = { methods: [{ entrypoint: "create_fake_game" }] };

    policies.contracts![paperAddress].methods.push({
      entrypoint: "faucet",
    });

    policies.contracts![dopeLootClaimAddress].methods.push({
      entrypoint: "claim_loot_from_forwarder",
    });
    policies.contracts![dopeLootClaimAddress].methods.push({
      entrypoint: "claim_og_from_forwarder",
    });

    policies.contracts![laundromatAddress].methods.push({
      entrypoint: "supercharge_jackpot",
    });

    policies.contracts![selectedChain.vrfProviderAddress].methods.push({
      entrypoint: "submit_random",
    });
    policies.contracts![selectedChain.vrfProviderAddress].methods.push({
      entrypoint: "assert_consumed",
    });
  }

  // console.log(policies);

  return new ControllerConnector({
    chains: [
      {
        rpcUrl: selectedChain.rpcUrl ? selectedChain.rpcUrl : "http://localhost:5050",
      },
    ],
    defaultChainId: `0x${selectedChain.chainConfig.id.toString(16)}`,
    slot: selectedChain.slot ? selectedChain.slot : "ryo",
    namespace: selectedChain.namespace ? selectedChain.namespace : "dopewars_v0",
    tokens: {
      erc20: ["strk", "usdc"],
    },
    preset: "dope-wars",
    policies,
  }) as unknown as InjectedConnector;
};

// const controller = cartridgeConnector({ selectedChain: dojoContextConfig.KATANA });

export function StarknetProvider({ children, selectedChain }: { children: ReactNode; selectedChain: DojoChainConfig }) {
  const router = useRouter();

  // const chains = getStarknetProviderChains();
  const { chains, connectors, provider } = useMemo(() => {
    return {
      chains: [selectedChain.chainConfig],
      provider: customJsonRpcProvider(selectedChain),
      connectors: getConnectorsForChain(selectedChain, router.asPath),
    };
  }, [selectedChain]);

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}
