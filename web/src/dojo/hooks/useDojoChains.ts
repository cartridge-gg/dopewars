
import { Chain } from "@starknet-react/chains";
import { useEffect, useMemo, useState } from "react";
import { shortString } from "starknet";
import { DojoChainConfig, DojoContextConfig, SupportedChainIds } from "../setup/config";

export type DojoChainsResult = ReturnType<typeof useDojoChains>;

export const useDojoChains = (dojoContextConfig: DojoContextConfig, defaultChain: DojoChainConfig) => {

    const [selected, setSelected] = useState<DojoChainConfig>(defaultChain);

    const setSelectedChain = (chain: DojoChainConfig) => {
        setSelected(chain)
        const chainId = shortString.decodeShortString(`0x${chain.chainConfig.id.toString(16)}`)
        window?.localStorage?.setItem("lastSelectedChainId", chainId)
    }

    const isKatana = useMemo(() => selected.chainConfig.network === "katana", [selected]);

    const chains: Chain[] = useMemo(
        () =>
            Object.keys(dojoContextConfig).map((key) => {
                return dojoContextConfig[key as SupportedChainIds].chainConfig;
            }),
        [dojoContextConfig],
    );


    useEffect(() => {
        const lastSelectedChainId = (typeof window !== "undefined") ? window?.localStorage?.getItem("lastSelectedChainId") : undefined;
        const toSelect = lastSelectedChainId && dojoContextConfig[lastSelectedChainId as SupportedChainIds] ?
            dojoContextConfig[lastSelectedChainId as SupportedChainIds] :
            defaultChain;

        setSelected(toSelect)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        dojoContextConfig,
        selectedChain: selected,
        setSelectedChain,
        isKatana,
        chains
    }
}

