import {
  Name,
  Market,
  Location,
  Risks,
  useLocationEntitiesQuery,
} from "@/generated/graphql";
import { useEffect, useState } from "react";
import { shortString } from "starknet";
import { SCALING_FACTOR } from "..";

interface LocationEntityData {
  entities: [
    {
      components: (Name | Market | Location | Risks)[];
    },
  ];
}

type DrugMarket = {
  name: string; // drug name
  price: BigInt;
  marketPool: Market;
};

export class LocationEntity {
  name: string; // location name
  risks: Risks;
  drugMarkets: DrugMarket[];

  constructor(name: string, risks: Risks, drugMarkets: DrugMarket[]) {
    this.name = name;
    this.risks = risks;
    this.drugMarkets = drugMarkets;
  }

  static create(data: LocationEntityData): LocationEntity | undefined {
    if (!data || !data.entities) return undefined;

    // location related entities
    const locationEntities = data.entities.find((entity) =>
      entity.components.find(
        (component) => component.__typename === "Location",
      ),
    );
    const locationComponent = locationEntities?.components.find(
      (component) => component.__typename === "Location",
    ) as Location;
    const locationName = shortString.decodeShortString(locationComponent.name);
    const risksComponent = locationEntities?.components.find(
      (component) => component.__typename === "Risks",
    ) as Risks;

    // drug market related entities
    const drugMarketEntities = data.entities.filter((entity) =>
      entity.components.find((component) => component.__typename === "Market"),
    );
    const drugMarkets: DrugMarket[] = drugMarketEntities.map((entity) => {
      const marketComponent = entity.components.find(
        (component) => component.__typename === "Market",
      ) as Market;

      const nameComponent = entity.components.find(
        (component) => component.__typename === "Name",
      ) as Name;

      const drugName = shortString.decodeShortString(
        nameComponent.short_string,
      );
      const price =
        BigInt(marketComponent.quantity) /
        (BigInt(marketComponent.cash) / BigInt(SCALING_FACTOR));

      return {
        name: drugName,
        price,
        marketPool: marketComponent,
      };
    });

    if (!locationEntities || !risksComponent || drugMarkets.length === 0)
      return undefined;

    return {
      name: locationName,
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
  locationName,
}: {
  gameId?: string;
  locationName?: string;
}): LocationInterface => {
  const [location, setLocation] = useState<LocationEntity>();

  const { data, isFetched } = useLocationEntitiesQuery(
    {
      gameId: gameId || "",
      location: shortString.encodeShortString(locationName || ""),
    },
    {
      enabled: !!gameId && !!locationName,
    },
  );

  useEffect(() => {
    const location_ = LocationEntity.create(data as LocationEntityData);
    if (location_) setLocation(location_);
  }, [data]);

  return {
    location,
    isFetched,
  };
};
