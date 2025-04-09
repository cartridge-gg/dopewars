import { DojoProvider } from "@dojoengine/core";
import { GraphQLClient } from "graphql-request";
import { createClient } from "graphql-ws";
import { useEffect, useMemo, useState } from "react";
import { QueryClient } from "react-query";
import { RpcProvider } from "starknet";
import { DojoChainConfig } from "../setup/config";
import { ToriiClient } from "@dojoengine/torii-client";

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

  const rpcProvider = useMemo(
    () =>
      new RpcProvider({
        nodeUrl: selectedChain.rpcUrl,
      }),
    [selectedChain],
  );

  const [toriiClient, setToriiClient] = useState<ToriiClient>();

  useEffect(() => {
    const initAsync = async () => {
      const torii = await import("@dojoengine/torii-client");
      const client = await torii.createClient({
        toriiUrl: selectedChain.toriiUrl.replace("/graphql", ""),
        relayUrl: "",
        worldAddress: selectedChain.manifest.world.address || "",
      });

      setToriiClient(client);
    };
    initAsync();
  }, [selectedChain]);

  return {
    dojoProvider,
    queryClient,
    graphqlClient,
    rpcProvider,
    toriiClient: toriiClient!,
  };
};
