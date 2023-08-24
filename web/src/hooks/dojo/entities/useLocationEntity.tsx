import {
  Name,
  Market,
  Risks,
  useLocationEntitiesQuery,
  Entity,
  EntityEdge,
} from "@/generated/graphql";
import { useEffect, useState } from "react";
import { shortString } from "starknet";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "..";

interface LocationEntityData {
  entities: [
    {
      components: (Market | Risks)[];
    },
  ];
}

export type DrugMarket = {
  name: string; // drug name
  price: number;
  marketPool: Market;
};

export class LocationEntity {
  name: string; // location name same as id
  risks: Risks;
  drugMarkets: DrugMarket[];

  constructor(name: string, risks: Risks, drugMarkets: DrugMarket[]) {
    this.name = name;
    this.risks = risks;
    this.drugMarkets = drugMarkets;
  }

  static create(edges: EntityEdge[]): LocationEntity | undefined {
    if (!edges || edges.length === 0) return undefined;

    // we know both location and risk component uses key[1] as locationId
    const keys = edges[0].node?.keys || [];
    const locationId = keys[1]!;

    const risksComponent = edges.find((edge) => {
      const components = edge.node?.components || [];
      return components[0]!.__typename === "Risks";
    }) as Risks;

    const drugMarketEntities = edges.filter((edge) => {
      edge.node?.components?.find(
        (component) => component?.__typename === "Market",
      );
    }) as EntityEdge[];

    const drugMarkets: DrugMarket[] = drugMarketEntities.map((edge) => {
      const marketComponent = edge.node?.components?.find(
        (component) => component?.__typename === "Market",
      ) as Market;

      const keys = edge.node?.keys || [];
      const drugName = keys[2]!;

      const drugId = shortString.decodeShortString(drugName);
      const price =
        Number(marketComponent.cash) /
        Number(marketComponent.quantity) /
        SCALING_FACTOR;

      return {
        name: drugId,
        price: price,
        marketPool: marketComponent,
      };
    });

    if (!risksComponent || drugMarkets.length === 0) return undefined;

    // sort by name
    drugMarkets.sort((a, b) => a.name.localeCompare(b.name));

    return {
      name: shortString.decodeShortString(locationId),
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
      locationId: shortString.encodeShortString(locationId || ""),
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
