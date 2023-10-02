import { Market, MarketEdge, useMarketPricesQuery } from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { num } from "starknet";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "../constants";
import { LocationPrices, DrugMarket } from "../types";

export class MarketPrices {
  locationPrices: LocationPrices;

  constructor(locationMarkets: LocationPrices) {
    this.locationPrices = locationMarkets;
  }

  static create(edges: MarketEdge[]): LocationPrices | undefined {
    if (!edges || edges.length === 0) return undefined;

    const locationPrices: LocationPrices = new Map();

    for (let edge of edges) {
      const node = edge.node;
      const locationId = num.toHexString(node?.location_id);
      const drugId = num.toHexString(node?.drug_id);
      const price =
        Number(node?.cash) / Number(node?.quantity) / SCALING_FACTOR;

      const drugMarket: DrugMarket = {
        id: drugId,
        price: price,
        marketPool: node as Market,
      };

      if (locationPrices.has(locationId)) {
        locationPrices.get(locationId)?.push(drugMarket);
      } else {
        locationPrices.set(locationId, [drugMarket]);
      }
    }

    return locationPrices;
  }
}

export interface MarketsInterface {
  locationPrices?: LocationPrices;
}

export const useMarketPrices = ({
  gameId,
}: {
  gameId?: string;
}): MarketsInterface => {
  const { data } = useMarketPricesQuery(
    { gameId: Number(gameId) },

    {
      enabled: !!gameId,
      refetchInterval: REFETCH_INTERVAL,
    },
  );

  const locationPrices = useMemo(() => {
    return MarketPrices.create(data?.marketComponents?.edges as MarketEdge[]);
  }, [data]);

  return {
    locationPrices,
  };
};
