import { DojoProvider } from "@dojoengine/core";
// import { createClient } from "@dojoengine/torii-client";
import { Config } from "./config";
import { QueryClient, QueryClientProvider } from "react-query";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup(config: Config) {

    // // torii client  issues with webpack 5
    // const toriiClient = await createClient([], {
    //     rpcUrl: config.rpcUrl,
    //     toriiUrl: config.toriiUrl,
    //     worldAddress: config.manifest.world.address || "",
    // });


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



