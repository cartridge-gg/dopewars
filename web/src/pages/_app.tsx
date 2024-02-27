import Fonts from "@/theme/fonts";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import theme from "../theme";

import Debug from "@/components/Debug";
import MakeItRain from "@/components/MakeItRain";
import RegisterEntities from "@/components/RegisterEntities";
import { DojoProvider } from "@/dojo/context/DojoContext";
import { dojoConfig } from "@/dojo/setup/config";
import { SetupResult, setup } from "@/dojo/setup/setup";
import StarknetProviders from "@/dojo/wallet/StarknetProviders";
import useKonamiCode, { starkpimpSequence } from "@/hooks/useKonamiCode";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import { QueryClientProvider } from "react-query";

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

  const [setupResult, setSetupResult] = useState<SetupResult | undefined>(undefined);

  useEffect(() => {
    const init = async () => {
      const setupResult = await setup(dojoConfig());
      setSetupResult(setupResult);
    };

    init();
  }, []);
 
  return (
    <>
      {setupResult && (
        <QueryClientProvider client={setupResult.queryClient}>
          <StarknetProviders>
          <DojoProvider value={setupResult}>
              <RegisterEntities />
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
                <Analytics />
                <Debug />
              </ChakraProvider>
          </DojoProvider>
          </StarknetProviders>
        </QueryClientProvider>
      )}
    </>
  );
}
