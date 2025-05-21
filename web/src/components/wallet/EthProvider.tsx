import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet } from "wagmi/chains";

const queryClient = new QueryClient();

export default function EthProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          coolMode
          modalSize="compact"
          theme={darkTheme({
            accentColor: "#202F20",
            accentColorForeground: "#11ED83",
            borderRadius: "small",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const config = getDefaultConfig({
  appName: "Dope",
  //   projectId: "2664648b3bd5bb62dc6dccbc89724d8c",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet],
  ssr: false,
  transports: {
    [mainnet.id]: http(),
  },
});
