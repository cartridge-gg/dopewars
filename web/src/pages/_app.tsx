import NextHead from "next/head";
import { ChakraProvider, Text } from "@chakra-ui/react";
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

const provider = new RpcProvider({ nodeUrl: "http://localhost:5050" });

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
    <StarknetProvider connectors={connectors} defaultProvider={provider}>
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
    </StarknetProvider>
  );
}
