import { DojoProvider } from "@dojoengine/core";
// import { createClient } from "@dojoengine/torii-client";
import { Config } from "./config";
import { QueryClient, QueryClientProvider } from "react-query";
import { Client, createClient } from "graphql-ws";
import { GraphQLClient } from "graphql-request";

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

    const graphqlClient = new GraphQLClient(config.toriiUrl)

    const graphqlWsClient = createClient({
        url: config.toriiWsUrl,
    })


    return {
        config,
        dojoProvider,
        queryClient,
        graphqlClient,
        graphqlWsClient
    };
}



