import { RyoMeta, RyoMetaEdge, useRyoMetasQuery } from "@/generated/graphql";
import { useMemo } from "react";
import { REFETCH_INTERVAL } from "../constants";

export class RyoMetas {
  static create(edges: RyoMetaEdge[]): RyoMeta | undefined {
    if (!edges || edges.length === 0) return undefined;
    return edges[0].node as RyoMeta;
  }
}

export interface RyoMetasInterface {
  ryoMetas?: RyoMeta;
  isFetched: boolean;
}

export const useRyoMetas = (): RyoMetasInterface => {
  const { data, isFetched } = useRyoMetasQuery(
    {},
    {
      enabled: true,
      refetchInterval: 10 * REFETCH_INTERVAL,
    },
  );

  const ryoMetas = useMemo(() => {
    return RyoMetas.create(data?.ryometaModels?.edges as RyoMetaEdge[]);
  }, [data]);

  return {
    ryoMetas,
    isFetched,
  };
};
