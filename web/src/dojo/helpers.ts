import {
  Brooklyn,
  CentralPark,
  ConeyIsland,
  Manhattan,
  Queens,
  Bronx,
} from "@/components/icons/locations";

import {
  Ludes,
  Weed,
  Acid,
  Speed,
  Heroin,
  Cocaine,
} from "@/components/icons/drugs";

import {
  Drug,
  DrugInfo,
  DrugMarket,
  Location,
  LocationInfo,
  Outcome,
  OutcomeInfo,
  PlayerStatus,
} from "./types";
import { getMuggerResponses, getCopResponses } from "@/responses";

export const locations: LocationInfo[] = [
  {
    type: Location.Queens,
    name: "Queens",
    slug: "queens",
    id: "Queens",
    icon: Queens,
  },
  {
    type: Location.Bronx,
    name: "The Bronx",
    slug: "bronx",
    id: "Bronx",
    icon: Bronx,
  },
  {
    type: Location.Brooklyn,
    name: "Brooklyn",
    slug: "brooklyn",
    id: "Brooklyn",
    icon: Brooklyn,
  },
  {
    type: Location.Jersey,
    name: "Jersey City",
    slug: "jersey",
    id: "Jersey",
    icon: Manhattan,
  },
  {
    type: Location.Central,
    name: "Central Park",
    slug: "central",
    id: "Central",
    icon: CentralPark,
  },
  {
    type: Location.Coney,
    name: "Coney Island",
    slug: "coney",
    id: "Coney",
    icon: ConeyIsland,
  },
];

const drugs: DrugInfo[] = [
  {
    type: Drug.Ludes,
    name: "Ludes",
    slug: "ludes",
    id: "Ludes",
    icon: Ludes,
  },
  {
    type: Drug.Speed,
    name: "Speed",
    slug: "speed",
    id: "Speed",
    icon: Speed,
  },
  {
    type: Drug.Weed,
    name: "Weed",
    slug: "weed",
    id: "Weed",
    icon: Weed,
  },
  {
    type: Drug.Acid,
    name: "Acid",
    slug: "acid",
    id: "Acid",
    icon: Acid,
  },
  {
    type: Drug.Heroin,
    name: "Heroin",
    slug: "heroin",
    id: "Heroin",
    icon: Heroin,
  },
  {
    type: Drug.Cocaine,
    name: "Cocaine",
    slug: "cocaine",
    id: "Cocaine",
    icon: Cocaine,
  },
];

export const outcomes: OutcomeInfo[] = [
  {
    name: "Paid the Cop",
    type: Outcome.Paid,
    status: PlayerStatus.BeingArrested,
    imageSrc: "/images/sunset.png",
    description: "You paid the cop off",
    getResponse: (isInitial: boolean) =>
      getCopResponses(Outcome.Paid, isInitial),
    color: "yellow.400",
  },
  {
    name: "Escaped",
    type: Outcome.Escaped,
    status: PlayerStatus.BeingArrested,
    imageSrc: "/images/sunset.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(Outcome.Escaped, isInitial),
    color: "neon.200",
  },
  {
    name: "Paid the Gang",
    type: Outcome.Paid,
    status: PlayerStatus.BeingMugged,
    imageSrc: "/images/sunset.png",
    description: "You paid the gang off",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Escaped, isInitial),
    color: "neon.200",
  },
  {
    name: "Escaped",
    type: Outcome.Escaped,
    status: PlayerStatus.BeingMugged,
    imageSrc: "/images/sunset.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Escaped, isInitial),
    color: "neon.200",
  },
  {
    name: "Got killed by the Gang",
    type: Outcome.Died,
    status: PlayerStatus.BeingMugged,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Died, isInitial),
    color: "red",
  },
  {
    name: "Got killed by the Cops",
    type: Outcome.Died,
    status: PlayerStatus.BeingArrested,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Died, isInitial),
    color: "red",
  },
];

function findBy<T>(array: T[], key: keyof T, value: any): T | undefined {
  return array.find((item) => item[key] === value);
}

export function getLocationByType(type: Location) {
  return findBy<LocationInfo>(locations, "type", type);
}

export function getLocationById(id?: string) {
  return findBy<LocationInfo>(locations, "id", id);
}

export function getLocationBySlug(slug: string) {
  return findBy<LocationInfo>(locations, "slug", slug);
}

export function getDrugById(id: string) {
  return findBy<DrugInfo>(drugs, "id", id);
}

export function getDrugBySlug(slug: string) {
  return findBy<DrugInfo>(drugs, "slug", slug);
}

export function getDrugByType(type: Drug) {
  return findBy<DrugInfo>(drugs, "type", type);
}

export function getOutcomeInfo(
  status: PlayerStatus,
  type: Outcome,
): OutcomeInfo {
  const found = outcomes.find((item) => {
    return item.status === status && item.type === type;
  });
  if (!found) {
    console.log(`getOutcomeInfo outcome ${status} ${type} not found !`);
  }
  return found || outcomes[0];
}

export function sortDrugMarkets(drugMarkets?: DrugMarket[]): DrugMarket[] {
  if (!drugMarkets) {
    return [];
  }
  return drugMarkets.sort((a, b) => Number(a.type) - Number(b.type))
}
