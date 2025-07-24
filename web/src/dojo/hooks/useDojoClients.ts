import { DojoProvider } from "@dojoengine/core";
import { ToriiClient } from "@dojoengine/torii-client";
import { GraphQLClient } from "graphql-request";
import { useEffect, useMemo, useState } from "react";
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
      const client = await new ToriiClient({
        toriiUrl: selectedChain.toriiUrl.replace("/graphql", ""),
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
