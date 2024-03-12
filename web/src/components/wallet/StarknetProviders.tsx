import { useDojoContext } from "@/dojo/hooks";
import { Chain } from "@starknet-react/chains";
import {
  ExplorerFactory,
  StarknetConfig,
  argent,
  braavos,
  jsonRpcProvider,
  starkscan
} from "@starknet-react/core";
import { ReactNode, useState } from "react";

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

  // //const provider = publicProvider();
  // const [recommended, setRecommanded] = useState([]);

  // useEffect(() => {
  //   if (isKatana) {
  //     setRecommanded(listConnectors());
  //   } else {
  //     setRecommanded([argent(), braavos()]);
  //   }
  // }, [isKatana, selectedChain]);

  // useEffect(() => {
  //   console.log(recommended)
  // }, [recommended])

  // const { connectors } = useInjectedConnectors({
  //   // Show these connectors if the user has no connector installed.
  //   recommended: isKatana ? listConnectors() : [argent(), braavos()],
  //   // Hide recommended connectors if the user has any connector installed.
  //   includeRecommended: "always",
  //   // Randomize the order of the connectors.
  //   // order: "random"
  // });

  // const connectors = useMemo(() => {
  //   return isKatana ? listConnectors() : [argent(), braavos()];
  // }, [selectedChain, isKatana, listConnectors()]);

  const connectors = isKatana ? listConnectors() : [argent(), braavos()];

  // TODO: remove
  const provider = jsonRpcProvider({ rpc });

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}
