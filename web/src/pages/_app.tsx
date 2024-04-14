import { LoadingModal, MakeItRain, QuitGameModal, RefreshGameModal } from "@/components/layout";
import { AccountDetailsModal, ConnectModal } from "@/components/wallet";
import { DeployingModal } from "@/components/wallet/DeployingModal";
import { DojoContextProvider } from "@/dojo/context/DojoContext";
import { useAutoBurner } from "@/dojo/hooks/useAutoBurner";
import { dojoContextConfig } from "@/dojo/setup/config";
import useKonamiCode, { starkpimpSequence } from "@/hooks/useKonamiCode";
import Fonts from "@/theme/fonts";
import GlobalStyles from "@/theme/global";
import { ChakraProvider } from "@chakra-ui/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import { useEffect } from "react";
import theme from "../theme";


// should avoid mobx memory leaks / GC issue..
import { enableStaticRendering } from "mobx-react-lite";
enableStaticRendering(typeof window === "undefined");

export default function App({ Component, pageProps }: AppProps) {
  const { setSequence, isRightSequence, setIsRightSequence } = useKonamiCode(starkpimpSequence);

  useEffect(() => {
    if (isRightSequence) {
      // stop rain after 20s
      setTimeout(() => {
        isRightSequence && setIsRightSequence(false);
        setSequence([]);
      }, 20_000);
    }
  }, [isRightSequence, setIsRightSequence, setSequence]);

  useAutoBurner()

  return (
    <>
      <ChakraProvider theme={theme}>
        <DojoContextProvider dojoContextConfig={dojoContextConfig}>
          <Fonts />
          <GlobalStyles />
          <NextHead>
            <title>Roll your Own</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
          </NextHead>
          {isRightSequence && <MakeItRain />}
          <Component {...pageProps} />
          <SpeedInsights />
          {/* <Debug /> */}

          {/* Common modales */}
          <LoadingModal />
          <DeployingModal />
          <ConnectModal />
          <AccountDetailsModal />
          <QuitGameModal />
          <RefreshGameModal />
        </DojoContextProvider>
      </ChakraProvider>
    </>
  );
}
