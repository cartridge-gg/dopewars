import { DojoProvider } from "@dojoengine/core";
import { GraphQLClient } from "graphql-request";
import { createClient } from "graphql-ws";
import { useMemo } from "react";
import { QueryClient } from "react-query";
import { RpcProvider } from "starknet";
import { DojoChainConfig } from "../setup/config";

export type DojoClientsResult = ReturnType<typeof useDojoClients>;

export const useDojoClients = (selectedChain: DojoChainConfig) => {
  const dojoProvider = useMemo(() => {
    return new DojoProvider(selectedChain.manifest, selectedChain.rpcUrl);
  }, [selectedChain]);

  const queryClient = useMemo(
    () => {
      return new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 20,
          },
        },
      });
    },
    [
      /*selectedChain*/
    ],
  );

  const graphqlClient = useMemo(() => {
    return new GraphQLClient(selectedChain.toriiUrl);
  }, [selectedChain]);

  const graphqlWsClient = useMemo(() => {
    return createClient({
      url: selectedChain.toriiWsUrl,
    });
  }, [selectedChain]);

  const rpcProvider = useMemo(
    () =>
      new RpcProvider({
        nodeUrl: selectedChain.rpcUrl,
      }),
    [selectedChain],
  );

  return {
    dojoProvider,
    queryClient,
    graphqlClient,
    graphqlWsClient,
    rpcProvider,
  };
};
