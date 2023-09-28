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
    type: Location.Central,
    name: "Central Park",
    slug: "central",
    id: "0x43656e7472616c205061726b",
    icon: CentralPark,
  },
  {
    type: Location.Queens,
    name: "Queens",
    slug: "queens",
    id: "0x517565656e73",
    icon: Queens,
  },
  {
    type: Location.Bronx,
    name: "The Bronx",
    slug: "bronx",
    id: "0x5468652042726f6e78",
    icon: Bronx,
  },
  {
    type: Location.Jersey,
    name: "Jersey City",
    slug: "jersey",
    id: "0x4a65727365792043697479",
    icon: Manhattan,
  },
  {
    type: Location.Coney,
    name: "Coney Island",
    slug: "coney",
    id: "0x436f6e65792049736c616e64",
    icon: ConeyIsland,
  },
  {
    type: Location.Brooklyn,
    name: "Brooklyn",
    slug: "brooklyn",
    id: "0x42726f6f6b6c796e",
    icon: Brooklyn,
  },
];

const drugs: DrugInfo[] = [
  {
    type: Drug.Ludes,
    name: "Ludes",
    slug: "ludes",
    id: "0x4c75646573",
    icon: Ludes,
  },
  {
    type: Drug.Speed,
    name: "Speed",
    slug: "speed",
    id: "0x5370656564",
    icon: Speed,
  },
  {
    type: Drug.Weed,
    name: "Weed",
    slug: "weed",
    id: "0x57656564",
    icon: Weed,
  },
  {
    type: Drug.Acid,
    name: "Acid",
    slug: "acid",
    id: "0x41636964",
    icon: Acid,
  },
  {
    type: Drug.Heroin,
    name: "Heroin",
    slug: "heroin",
    id: "0x4865726f696e",
    icon: Heroin,
  },
  {
    type: Drug.Cocaine,
    name: "Cocaine",
    slug: "cocaine",
    id: "0x436f6361696e65",
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
    getResponse: (isInitial: boolean) => {
      let response = getMuggerResponses(Outcome.Escaped, isInitial);
      // TODO: make this way nicer + color + maybe this is not the right place?
      response += "You fled to a random location";
      return response;
    },
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
    getResponse: (isInitial: boolean) => {
      let response = getMuggerResponses(Outcome.Escaped, isInitial);
      // TODO: make this way nicer + color + maybe this is not the right place?
      response += "You fled to a random location";
      return response;
    },
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

  const ludes = drugMarkets.find(
    (drug) => getDrugById(drug.id)?.type === Drug.Ludes,
  )!;
  const speed = drugMarkets.find(
    (drug) => getDrugById(drug.id)?.type === Drug.Speed,
  )!;
  const weed = drugMarkets.find(
    (drug) => getDrugById(drug.id)?.type === Drug.Weed,
  )!;
  const acid = drugMarkets.find(
    (drug) => getDrugById(drug.id)?.type === Drug.Acid,
  )!;
  const heroin = drugMarkets.find(
    (drug) => getDrugById(drug.id)?.type === Drug.Heroin,
  )!;
  const cocaine = drugMarkets.find(
    (drug) => getDrugById(drug.id)?.type === Drug.Cocaine,
  )!;
  return [ludes, speed, weed, acid, heroin, cocaine];
}
