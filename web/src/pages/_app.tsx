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

const address =
  "0x3ee9e18edc71a6df30ac3aca2e0b02a198fbce19b7480a63a0d71cbd76652e0";
const privateKey =
  "0x300001800000000300000180000000000030000000000003006001800006600";
const worldAddress =
  "0x74d6cf3625879d81555bf20ee8a2273f9cc6202c13d35d71504810c14f7ef94";
const provider = new RpcProvider({ nodeUrl: "http://localhost:5050" });
const account = new Account(provider, address, privateKey);

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
    <DojoProvider worldAddress={worldAddress} account={account}>
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
  );
}
