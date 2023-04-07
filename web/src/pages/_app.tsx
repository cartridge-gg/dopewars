import { ModalProvider } from "@/components/Modal/ModalProvider";
import { ChakraProvider } from "@chakra-ui/react";
import {
  InjectedConnector,
  StarknetConfig,
  StarknetProvider,
} from "@starknet-react/core";
import type { AppProps } from "next/app";
import theme from "../theme";
import ControllerConnector from "@cartridge/connector";
import localFont from "@next/font/local";
import Background from "@/components/Background";

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

const chicagoFont = localFont({
  src: [
    {
      path: "../../public/fonts/ChicagoFLF.ttf",
      style: "normal",
    },
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StarknetProvider connectors={connectors}>
      <ChakraProvider theme={theme}>
        <ModalProvider>
          <main className={chicagoFont.className}>
            <Background />
            <Component {...pageProps} />
          </main>
        </ModalProvider>
      </ChakraProvider>
    </StarknetProvider>
  );
}
