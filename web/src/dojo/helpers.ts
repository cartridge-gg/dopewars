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
    name: "Bribed the Cop",
    type: Outcome.Paid,
    status: PlayerStatus.BeingArrested,
    imageSrc: "/images/sunset.png",
    description: "You paid the cop off",
    getResponse: (isInitial: boolean) =>
      getCopResponses(Outcome.Paid, isInitial),
    color: "yellow.400",
  },
  {
    name: "Got Arrested",
    type: Outcome.Captured,
    status: PlayerStatus.BeingArrested,
    imageSrc: "/images/events/police_cruiser.gif",
    description: "You lost 50% of all your drugs",
    getResponse: (isInitial: boolean) =>
      getCopResponses(Outcome.Captured, isInitial),
    color: "red",
  },
  {
    name: "Escaped the Cops",
    type: Outcome.Escaped,
    status: PlayerStatus.BeingArrested,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(Outcome.Escaped, isInitial),
    color: "neon.200",
  },
  {
    name: "Fought the Gang",
    type: Outcome.Fought,
    status: PlayerStatus.BeingMugged,
    imageSrc: "/images/events/fought.png",
    description: "You lost some health",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Fought, isInitial),
    color: "yellow.400",
  },
  {
    name: "Got Captured",
    type: Outcome.Captured,
    status: PlayerStatus.BeingMugged,
    imageSrc: "/images/sunset.png",
    description: "You lost 50% of all your cash",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Captured, isInitial),
    color: "red",
  },
  {
    name: "Escaped the Gang",
    type: Outcome.Escaped,
    status: PlayerStatus.BeingMugged,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Escaped, isInitial),
    color: "neon.200",
  },
];

function findBy<T>(array: T[], key: keyof T, value: any): T | undefined {
  return array.find((item) => item[key] === value);
}

export function getLocationByType(type: Location): LocationInfo {
  return findBy<LocationInfo>(locations, "type", type) || locations[0];
}

export function getLocationById(id: string): LocationInfo {
  return findBy<LocationInfo>(locations, "id", id) || locations[0];
}

export function getLocationBySlug(slug: string): LocationInfo {
  return findBy<LocationInfo>(locations, "slug", slug) || locations[0];
}

export function getDrugById(id: string): DrugInfo {
  return findBy<DrugInfo>(drugs, "id", id) || drugs[0];
}

export function getDrugBySlug(slug: string): DrugInfo {
  return findBy<DrugInfo>(drugs, "slug", slug) || drugs[0];
}

export function getDrugByType(type: Drug): DrugInfo {
  return findBy<DrugInfo>(drugs, "type", type) || drugs[0];
}

export function getOutcomeInfo(
  status: PlayerStatus,
  type: Outcome,
): OutcomeInfo {
  return (
    outcomes.find((item) => {
      return item.status === status && item.type === type;
    }) || outcomes[0]
  );
}
