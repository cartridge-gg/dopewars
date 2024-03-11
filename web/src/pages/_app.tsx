import RegisterEntities from "@/components/RegisterEntities";
import { MakeItRain } from "@/components/layout";
import { StarknetProviders } from "@/components/wallet";
import { DojoProvider } from "@/dojo/context/DojoContext";
import { dojoConfig } from "@/dojo/setup/config";
import { SetupResult, setup } from "@/dojo/setup/setup";
import useKonamiCode, { starkpimpSequence } from "@/hooks/useKonamiCode";
import Fonts from "@/theme/fonts";
import GlobalStyles from "@/theme/global";
import { ChakraProvider } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import { useEffect, useState } from "react";
import { QueryClientProvider } from "react-query";
import theme from "../theme";

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
          <DojoProvider value={setupResult}>
            <StarknetProviders>
              <RegisterEntities />
              <ChakraProvider theme={theme}>
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
                <Analytics />
                {/* <Debug /> */}
              </ChakraProvider>
            </StarknetProviders>
          </DojoProvider>
        </QueryClientProvider>
      )}
    </>
  );
}
