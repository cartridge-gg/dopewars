import { DW_NS } from "@/dojo/hooks";
import { DojoChainConfig } from "@/dojo/setup/config";
import { ControllerConnector } from "@cartridge/connector";
import { SessionPolicies } from "@cartridge/presets";
import { getContractByName } from "@dojoengine/core";
import {
  ChainProviderFactory,
  ExplorerFactory,
  InjectedConnector,
  StarknetConfig,
  argent,
  injected,
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
      return [controller, /*injected({ id: "dojoburner" }), */ injected({ id: "dojopredeployed" })];

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

  // const chains = getStarknetProviderChains();
  const chains = useMemo(() => {
    return [selectedChain.chainConfig];
  }, [selectedChain]);

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
        methods: [
          { entrypoint: "create_game" },
          { entrypoint: "travel" },
          { entrypoint: "end_game" },
          { entrypoint: "travel" },
        ],
      },
      [decideAddress]: {
        methods: [{ entrypoint: "decide" }],
      },
      [laundromatAddress]: {
        methods: [{ entrypoint: "register_score" }, { entrypoint: "claim" }, { entrypoint: "launder" }],
      },
      [dopeLootClaimAddress]: {
        methods: [{ entrypoint: "release" }, { entrypoint: "claim" }, { entrypoint: "open" }],
      },
      [dopeGearAddress]: {
        methods: [{ entrypoint: "mint" }, { entrypoint: "set_approval_for_all" }],
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
    const devtoolsAddress = getContractByName(selectedChain.manifest, DW_NS, "devtools")?.address;

    policies.contracts![devtoolsAddress] = { methods: [{ entrypoint: "create_fake_game" }] };

    policies.contracts![paperAddress].methods.push({
      entrypoint: "faucet",
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
      {
        rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
      },
      {
        rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet",
      },
    ],
    defaultChainId: `0x${selectedChain.chainConfig.id.toString(16)}`,
    url: selectedChain.keychain ? selectedChain.keychain : "https://x.cartridge.gg",
    // rpc: selectedChain.rpcUrl ? selectedChain.rpcUrl : "http://localhost:5050",
    // profileUrl: selectedChain.profileUrl ? selectedChain.profileUrl : undefined,
    namespace: selectedChain.namespace ? selectedChain.namespace : "dopewars",
    slot: selectedChain.slot ? selectedChain.slot : "ryo",
    tokens: {
      erc20: [
        // paperAddress
        "0x410466536b5ae074f7fea81e5533b8134a9fa08b3dd077dd9db08f64997d113",
      ],
    },
    preset: "dope-wars",
    // colorMode: "dark",
    policies,
  }) as unknown as InjectedConnector;
};
