import { Market, useLocationEntitiesQuery, World__EntityEdge } from "@/generated/graphql";
import { useMemo } from "react";
import { num } from "starknet";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "../constants";
import { Location, DrugMarket } from "../types";
import { getLocationById, getLocationByType, getDrugByType } from "../helpers";

export class LocationEntity {
  id: string; // id is hex encoded location name
  drugMarkets: DrugMarket[];

  constructor(id: string, drugMarkets: DrugMarket[]) {
    this.id = id;
    this.drugMarkets = drugMarkets;
  }

  static create(edges: World__EntityEdge[]): LocationEntity | undefined {
    if (!edges || edges.length === 0) return undefined;

    // we know both location and risk model uses key[1] as locationId
    //const keys = edges[0].node?.keys.split('/') || [];
    const keys = edges[0].node?.keys || [];
    const locationId = getLocationByType(Number(keys[1]!))!.id;

    const drugMarketEntities = edges.filter((edge) => {
      return edge.node?.models?.find((model) => model?.__typename === "Market");
    }) as World__EntityEdge[];

    const drugMarkets: DrugMarket[] = drugMarketEntities.map((edge) => {
      const marketModel = edge.node?.models?.find((model) => model?.__typename === "Market") as Market;

      // const keys = edge.node?.keys.split('/') || [];
      const keys = edge.node?.keys || [];
      const drugId = getDrugByType(Number(keys[2]!))!.id;
      const drugType = getDrugByType(Number(keys[2]!))!.type;

      const price = Number(marketModel.cash) / Number(marketModel.quantity) / SCALING_FACTOR;

      return {
        id: drugId,
        type: drugType,
        price: price,
        marketPool: marketModel,
      };
    });

    if (drugMarkets.length === 0) return undefined;

    return {
      id: locationId,
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
      locationId: `0x${getLocationById(locationId)?.type.toString(16)}` || "",
    },
    {
      enabled: !!gameId && !!locationId,
      refetchInterval: REFETCH_INTERVAL,
    },
  );

  const location = useMemo(() => {
    return LocationEntity.create(data?.entities?.edges as World__EntityEdge[]);
  }, [data]);

  return {
    location,
    isFetched,
  };
};
