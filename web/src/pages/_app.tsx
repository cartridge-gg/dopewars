import { LoadingModal, MakeItRain, QuitGameModal, RefreshGameModal } from "@/components/layout";
import { AccountDetailsModal, ConnectModal } from "@/components/wallet";
import { DojoContextProvider } from "@/dojo/context/DojoContext";
import { dojoContextConfig } from "@/dojo/setup/config";
import useKonamiCode, { psySequence, starkpimpSequence } from "@/hooks/useKonamiCode";
import { PaperPriceProvider } from "@/hooks/PaperPriceContext";
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
import { SeasonDetailsModal } from "@/components/pages/home/SeasonDetailsModal";
import { GlobalEvents } from "@/components/layout/GlobalEvents";
import ConnectionError from "@/components/layout/ConnectionError";
enableStaticRendering(typeof window === "undefined");

// import "@/dope/dist/style.css";
import { Toaster } from "react-hot-toast";
import { Psycadelic } from "@/components/common/Psycadelic";

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

  return (
    <>
      <ChakraProvider theme={theme}>
        <DojoContextProvider dojoContextConfig={dojoContextConfig}>
          <PaperPriceProvider>
            <Fonts />
            <GlobalStyles />
            <NextHead>
              <title>Dope Wars</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
              />
            </NextHead>
            {isRightSequence && <MakeItRain />}
            <Psycadelic />
            <Component {...pageProps} />
            <SpeedInsights />

            <LoadingModal />
            <ConnectModal />
            <AccountDetailsModal />
            <QuitGameModal />
            <RefreshGameModal />
            <SeasonDetailsModal />

            <GlobalEvents />

            <Toaster
              gutter={0}
              containerStyle={{
                inset: 0,
              }}
            />
          </PaperPriceProvider>
        </DojoContextProvider>
      </ChakraProvider>
    </>
  );
}
