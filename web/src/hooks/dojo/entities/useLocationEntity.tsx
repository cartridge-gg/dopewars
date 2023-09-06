import {
  Name,
  Market,
  Risks,
  useLocationEntitiesQuery,
  Entity,
  EntityEdge,
} from "@/generated/graphql";
import { useEffect, useState } from "react";
import { num, shortString } from "starknet";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "..";

export type DrugMarket = {
  id: string; // id is hex encoded drug name
  price: number;
  marketPool: Market;
};

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
    console.log(drugMarkets);
    if (!risksComponent || drugMarkets.length === 0) return undefined;

    // sort by name
    drugMarkets.sort((a, b) => a.id.localeCompare(b.id));

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
  const [location, setLocation] = useState<LocationEntity>();

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

  useEffect(() => {
    const location_ = LocationEntity.create(
      data?.entities?.edges as EntityEdge[],
    );
    if (location_) setLocation(location_);
  }, [data]);

  return {
    location,
    isFetched,
  };
};
