import {
  Market,
  Risks,
  useLocationEntitiesQuery,
  EntityEdge,
} from "@/generated/graphql";
import { useMemo } from "react";
import { num } from "starknet";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "..";
import { DrugMarket } from "../types";

export class LocationEntity {
  id: string; // id is hex encoded location name
  risks: Risks;
  drugMarkets: DrugMarket[];

  constructor(id: string, risks: Risks, drugMarkets: DrugMarket[]) {
    this.id = id;
    this.risks = risks;
    this.drugMarkets = drugMarkets;
  }

  static create(edges: EntityEdge[]): LocationEntity | undefined {
    if (!edges || edges.length === 0) return undefined;

    // we know both location and risk component uses key[1] as locationId
    const keys = edges[0].node?.keys || [];
    const locationId = keys[1]!;

    const risksComponent = edges.find((edge) => {
      return edge.node?.components?.some(
        (component) => component?.__typename === "Risks",
      );
    })?.node?.components?.[0] as Risks;

    const drugMarketEntities = edges.filter((edge) => {
      return edge.node?.components?.find(
        (component) => component?.__typename === "Market",
      );
    }) as EntityEdge[];

    const drugMarkets: DrugMarket[] = drugMarketEntities.map((edge) => {
      const marketComponent = edge.node?.components?.find(
        (component) => component?.__typename === "Market",
      ) as Market;

      const keys = edge.node?.keys || [];
      const drugId = num.toHexString(keys[2]!);

      const price =
        Number(marketComponent.cash) /
        Number(marketComponent.quantity) /
        SCALING_FACTOR;

      return {
        id: drugId,
        price: price,
        marketPool: marketComponent,
      };
    });

    if (!risksComponent || drugMarkets.length === 0) return undefined;

    return {
      id: locationId,
      risks: risksComponent,
      drugMarkets: drugMarkets,
    };
  }
}

export interface LocationInterface {
  location?: LocationEntity;
  isFetched: boolean;
}

export const useLocationEntity = ({
  gameId,
  locationId,
}: {
  gameId?: string;
  locationId?: string;
}): LocationInterface => {
  const { data, isFetched } = useLocationEntitiesQuery(
    {
      gameId: gameId || "",
      locationId: locationId || "",
    },
    {
      enabled: !!gameId && !!locationId,
      refetchInterval: REFETCH_INTERVAL,
    },
  );

  const location = useMemo(() => {
    return LocationEntity.create(data?.entities?.edges as EntityEdge[]);
  }, [data]);

  return {
    location,
    isFetched,
  };
};
