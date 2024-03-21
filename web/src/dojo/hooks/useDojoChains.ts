
import { Chain } from "@starknet-react/chains";
import { useMemo, useState } from "react";
import { DojoChainConfig, DojoContextConfig, SupportedChainIds } from "../setup/config";

export type DojoChainsResult = ReturnType<typeof useDojoChains>;

export const useDojoChains = (dojoContextConfig: DojoContextConfig) => {

    const [selectedChain, setSelectedChain] = useState<DojoChainConfig>(
        process.env.NODE_ENV === "production" ? dojoContextConfig.KATANA_SLOT : dojoContextConfig.KATANA,
    );

    const isKatana = useMemo(() => selectedChain.chainConfig.network === "katana", [selectedChain]);

    const chains: Chain[] = useMemo(
        () =>
            Object.keys(dojoContextConfig).map((key) => {
                return dojoContextConfig[key as SupportedChainIds].chainConfig;
            }),
        [dojoContextConfig],
    );

    return {
        dojoContextConfig,
        selectedChain,
        setSelectedChain,
        isKatana,
        chains
    }
}

