import NextHead from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import {
  InjectedConnector,
  StarknetConfig,
  StarknetProvider,
} from "@starknet-react/core";
import { RpcProvider, Account } from "starknet";
import type { AppProps } from "next/app";
import theme from "../theme";
import ControllerConnector from "@cartridge/connector";
import Fonts from "@/theme/fonts";

import useKonamiCode, { starkpimpSequence } from "@/hooks/useKonamiCode";
import MakeItRain from "@/components/MakeItRain";
import { useEffect } from "react";
import { DojoProvider } from "@/hooks/dojo";
import { PLAYER_ADDRESS, PLAYER_PRIVATE_KEY } from "@/constants";
import { QueryClient, QueryClientProvider } from "react-query";

export const controllerConnector = new ControllerConnector([
  {
    target: "0xdead",
    method: "have_turn",
  },
]);
export const argentConnector = new InjectedConnector({
  options: {
    id: "argentX",
  },
});
export const connectors = [controllerConnector as any, argentConnector];

const provider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT!,
});
const account = new Account(provider, PLAYER_ADDRESS, PLAYER_PRIVATE_KEY);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const { setSequence, isRightSequence, setIsRightSequence } =
    useKonamiCode(starkpimpSequence);

  useEffect(() => {
    if (isRightSequence) {
      // stop rain after 20s
      setTimeout(() => {
        isRightSequence && setIsRightSequence(false);
        setSequence([]);
      }, 20_000);
    }
  }, [isRightSequence, setIsRightSequence, setSequence]);

  return (
    <QueryClientProvider client={queryClient}>
      <DojoProvider account={account}>
        <ChakraProvider theme={theme}>
          <Fonts />
          <NextHead>
            <title>Roll your Own</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
          </NextHead>
          {isRightSequence && <MakeItRain />}
          <Component {...pageProps} />
        </ChakraProvider>
      </DojoProvider>
    </QueryClientProvider>
  );
}
