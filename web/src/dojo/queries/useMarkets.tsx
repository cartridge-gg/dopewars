import { BlindedMarket, BlindedMarketEdge, Market, MarketEdge, useBlindedMarketPricesQuery, useMarketPricesQuery } from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { num } from "starknet";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "../constants";
import { LocationPrices, DrugMarket, Drug } from "../types";
import { getDrugById } from "../helpers";
import SeismicClient from "@/seismic/client";

export type DrugMarketBlinded = {
  id: string;   
  type: Drug;
  price: string | number;
  marketPool: Market | BlindedMarket;
};

export type LocationPricesBlinded = Map<string, DrugMarketBlinded[]>;

export class MarketPrices {
  locationPrices: LocationPricesBlinded;
  seismic: SeismicClient

  constructor(locationMarkets: LocationPricesBlinded, seismic: SeismicClient) {
    this.locationPrices = locationMarkets; 
    this.seismic = seismic;
  }

  static create(edges: BlindedMarketEdge[], tradeParamsAtlocation: MarketPricesPerDrugId | undefined ): LocationPricesBlinded | undefined {
    if (!edges || edges.length === 0) return undefined;

    const locationPrices: LocationPricesBlinded = new Map();

    for (let edge of edges) {
      const node = edge.node;
      const locationId = node?.location_id;

      const drugId = node?.drug_id;
      const drugType = getDrugById(drugId)!.type;

      let drugMarket: DrugMarketBlinded = {
            id: drugId,
            type: drugType, 
            price: 0,
            marketPool: node as BlindedMarket
        }
    
    if (tradeParamsAtlocation && tradeParamsAtlocation[drugId]) {
      if (locationId == tradeParamsAtlocation[drugId].location_id) {
        const cashInt  = parseInt(tradeParamsAtlocation[drugId].cash, 16); 
        const price = Number(cashInt) / Number(tradeParamsAtlocation[drugId].quantity) / SCALING_FACTOR;
        drugMarket.price = price;
        drugMarket.marketPool = {
            ...drugMarket.marketPool,
            cash: cashInt,
            quantity: tradeParamsAtlocation[drugId].quantity
          };          
        }
    }
    if (locationPrices.has(locationId)) {
      locationPrices.get(locationId)?.push(drugMarket);
    }
    else {
      locationPrices.set(locationId, [drugMarket]);
    }
  }
  return locationPrices;
  }
}

export interface MarketsInterface {
  locationPrices?: LocationPricesBlinded;
}

interface MarketPricesPerDrugId {
    [drug_id: string]: {
        cash: string,
        quantity: number,
        location_id: string
    }
}

export const useMarketPrices = ({
  gameId,
  seismic
}: {
  gameId?: string, locationId?: string, seismic: SeismicClient;
}): MarketsInterface => {
  const [locationPrices, setLocationPrices] = useState<LocationPricesBlinded>();
  const [tradeParams, setTradeParams] = useState<MarketPricesPerDrugId>();

  const { data, isLoading } = useBlindedMarketPricesQuery(
    { gameId: Number(gameId) },
    {
      enabled: !!gameId,
      refetchInterval: REFETCH_INTERVAL,
    },
  ); 
  useEffect(() => {
    async function fetchTradeParameters() {
      if (gameId) {
        const params = await seismic.getTradeParameters(gameId);
        setTradeParams(params);
      }
    }

     fetchTradeParameters();
  }, [gameId, seismic]);

  useEffect(() => {

    if (!isLoading && data && tradeParams) {
      const createdLocationPrices = MarketPrices.create(data?.blindedMarketModels?.edges as BlindedMarketEdge[], tradeParams);
      setLocationPrices(createdLocationPrices);
    }
  }, [data, isLoading, tradeParams]);

  return {
    locationPrices,
  };
};
