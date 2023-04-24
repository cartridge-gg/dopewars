import { ModalProvider } from "@/components/Modal/ModalProvider";
import { ChakraProvider } from "@chakra-ui/react";
import {
  InjectedConnector,
  StarknetConfig,
  StarknetProvider,
} from "@starknet-react/core";
import { GameConfigProvider } from "@/hooks/config";
import type { AppProps } from "next/app";
import theme from "../theme";
import ControllerConnector from "@cartridge/connector";
import Fonts from "@/theme/fonts";

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StarknetProvider connectors={connectors}>
      <ChakraProvider theme={theme}>
        <Fonts />
        <ModalProvider>
          <GameConfigProvider>
            <Component {...pageProps} />
          </GameConfigProvider>
        </ModalProvider>
      </ChakraProvider>
    </StarknetProvider>
  );
}
