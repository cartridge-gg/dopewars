import { DojoProvider } from "@dojoengine/core";
// import { createClient as createToriiClient } from "@dojoengine/torii-client";
import { GraphQLClient } from "graphql-request";
import { createClient } from "graphql-ws";
import { QueryClient } from "react-query";
import { Config } from "./config";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup(config: Config) {

    // // torii client  issues with webpack 5
    // const toriiClient = await createToriiClient([], {
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



