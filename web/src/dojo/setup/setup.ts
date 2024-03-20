// import { DojoProvider } from "@dojoengine/core";
// import { GraphQLClient } from "graphql-request";
// import { createClient } from "graphql-ws";
// import { QueryClient } from "react-query";
// import { Config } from "./config";

// export type SetupResult = Awaited<ReturnType<typeof setup>>;

// export async function setup(config: Config) {

//     const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl)

//     const queryClient = new QueryClient({
//         defaultOptions: {
//             queries: {
//                 staleTime: 1000 * 20,
//             },
//         },
//     });

//     const graphqlClient = new GraphQLClient(config.toriiUrl)

//     const graphqlWsClient = createClient({
//         url: config.toriiWsUrl,
//     })

//     return {
//         config,
//         dojoProvider,
//         queryClient,
//         graphqlClient,
//         graphqlWsClient
//     };
// }



