import { Game, Season, World__ModelEdge, useClaimableQuery } from "@/generated/graphql";
import { useEffect, useMemo } from "react";
import { useDojoContext } from "./useDojoContext";

export type ClaimableResult = ReturnType<typeof useClaimable>;

export const useClaimable = (playerId: string) => {
  const {
    chains: { selectedChain },
  } = useDojoContext();

  const { data, isFetching, isRefetching, isError, refetch } = useClaimableQuery({
    playerId
  });

  useEffect(() => {
    refetch();
  }, [selectedChain.toriiUrl, refetch]);

  const claimable = useMemo(() => {
    if (isError || isFetching || isRefetching || !data) return [];

    const edges = data.gameModels?.edges as World__ModelEdge[];
    return edges.map((i: World__ModelEdge) => i.node as Game);
  }, [data, isFetching, isRefetching, isError]);

  return {
    claimable,
    isFetchingClaimable: isFetching || isRefetching,
    refetchClaimable: refetch,
  };
};
