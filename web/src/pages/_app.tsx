import NextHead from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { RpcProvider, Account } from "starknet";
import type { AppProps } from "next/app";
import theme from "../theme";
import Fonts from "@/theme/fonts";

import useKonamiCode, { starkpimpSequence } from "@/hooks/useKonamiCode";
import MakeItRain from "@/components/MakeItRain";
import { useEffect } from "react";
import { DojoProvider } from "@/dojo";
import { QueryClient, QueryClientProvider } from "react-query";
import { Analytics } from '@vercel/analytics/react';

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
      <DojoProvider>
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
        </ChakraProvider>
      </DojoProvider>
    </QueryClientProvider>
  );
}
