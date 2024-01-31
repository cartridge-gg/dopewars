import { DojoProvider } from "@dojoengine/core";
import { QueryClient } from "react-query";
import { Config } from "./config";

export type SetupResult = Awaited<ReturnType<typeof setup>>;


export async function setup(config: Config) {

    const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl)

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 20,
            },
        },
    });

  
    return {
        //network,
        config,
        dojoProvider,
        queryClient
    };
}



