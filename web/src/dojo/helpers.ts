import {
  Bronx,
  Brooklyn,
  CentralPark,
  ConeyIsland,
  Manhattan,
  Queens,
} from "@/components/icons/locations";

import {
  Acid,
  Cocaine,
  Heroin,
  Ludes,
  Speed,
  Weed,
} from "@/components/icons/drugs";

import { getCopResponses, getMuggerResponses } from "@/responses";
import {
  DrugInfo,
  Drugs,
  EncounterOutcomes,
  Encounters,
  EncountersAction,
  LocationInfo,
  Locations,
  OutcomeInfo,
  PlayerStatus
} from "./types";

import { Cigarette } from "@/components/icons";
import {
  Backpack,
  Bicycle,
  Dufflebag,
  Fannypack,
  Glock,
  Kevlar,
  Kneepads,
  Knife,
  Leatherjacket,
  Shoes,
  Skateboard,
  Uzi
} from "@/components/icons/items";



export const statName = {
  "Attack": "ATK",
  "Defense": "DEF",
  "Speed": "SPD",
  "Transport": "INV",
}

export const locationIcons = {
  "Queens": Queens,
  "Bronx": Bronx,
  "Brooklyn": Brooklyn,
  "Jersey": Manhattan,
  "Central": CentralPark,
  "Coney": ConeyIsland,
}

export const drugIcons = {
  "Ludes": Ludes,
  "Speed": Speed,
  "Weed": Weed,
  "Acid": Acid,
  "Heroin": Heroin,
  "Cocaine": Cocaine,
}

export const itemIcons = {
  "Naked": Cigarette,
  //
  "Knife": Knife,
  "Glock": Glock,
  "Uzi": Uzi,
  //
  "Fanny Pack": Fannypack,
  "Backpack": Backpack,
  "Duffle Bag": Dufflebag,
  //
  "Knee Pads": Kneepads,
  "Leather Jacket": Leatherjacket,
  "Kevlar": Kevlar,
  //
  "Shoes": Shoes,
  "Skateboard": Skateboard,
  "Bicycle": Bicycle,
}

export const locations: LocationInfo[] = [
  {
    type: Locations.Queens,
    name: "Queens",
    slug: "queens",
    id: "Queens",
    icon: Queens,
  },
  {
    type: Locations.Bronx,
    name: "The Bronx",
    slug: "bronx",
    id: "Bronx",
    icon: Bronx,
  },
  {
    type: Locations.Brooklyn,
    name: "Brooklyn",
    slug: "brooklyn",
    id: "Brooklyn",
    icon: Brooklyn,
  },
  {
    type: Locations.Jersey,
    name: "Jersey City",
    slug: "jersey",
    id: "Jersey",
    icon: Manhattan,
  },
  {
    type: Locations.Central,
    name: "Central Park",
    slug: "central",
    id: "Central",
    icon: CentralPark,
  },
  {
    type: Locations.Coney,
    name: "Coney Island",
    slug: "coney",
    id: "Coney",
    icon: ConeyIsland,
  },
];

const drugs: DrugInfo[] = [
  {
    type: Drugs.Ludes,
    name: "Ludes",
    slug: "ludes",
    id: "Ludes",
    icon: Ludes,
  },
  {
    type: Drugs.Speed,
    name: "Speed",
    slug: "speed",
    id: "Speed",
    icon: Speed,
  },
  {
    type: Drugs.Weed,
    name: "Weed",
    slug: "weed",
    id: "Weed",
    icon: Weed,
  },
  {
    type: Drugs.Acid,
    name: "Acid",
    slug: "acid",
    id: "Acid",
    icon: Acid,
  },
  {
    type: Drugs.Heroin,
    name: "Heroin",
    slug: "heroin",
    id: "Heroin",
    icon: Heroin,
  },
  {
    type: Drugs.Cocaine,
    name: "Cocaine",
    slug: "cocaine",
    id: "Cocaine",
    icon: Cocaine,
  },
];

export const outcomes: OutcomeInfo[] = [
  {
    title: "You",
    name: "Paid the Cop",
    type: EncounterOutcomes.Paid,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/paid.png",
    description: "You paid the cop off",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Paid, isInitial),
    color: "yellow.400",
  },
  {
    title: "You",
    name: "Paid the Gang",
    type: EncounterOutcomes.Paid,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/paid.png",
    description: "You paid the gang off",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Paid, isInitial),
    color: "neon.200",
  },
  {
    title: "You",
    name: "Escaped",
    type: EncounterOutcomes.Escaped,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Escaped, isInitial),
    description: "You fled to a random location",
    color: "neon.200",
  },
  {
    title: "You",
    name: "Escaped",
    type: EncounterOutcomes.Escaped,

    encounter: Encounters.Gang,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Escaped, isInitial),
    description: "You fled to a random location",
    color: "neon.200",
  },
  {
    title: "You",
    name: "Got killed by the Cops",
    type: EncounterOutcomes.Died,
    status: PlayerStatus.BeingArrested,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Died, isInitial),
    color: "red",
  },
  {
    title: "You",
    name: "Got killed by the Gang",
    type: EncounterOutcomes.Died,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Died, isInitial),
    color: "red",
  },
  {
    title: "You are",
    name: "Victorious!",
    type: EncounterOutcomes.Victorious,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/victorious.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Victorious, isInitial),
    color: "neon.200",
  },
  {
    title: "You are",
    name: "Victorious!",
    type: EncounterOutcomes.Victorious,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/victorious.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Victorious, isInitial),
    color: "neon.200",
  },

];




function findBy<T>(array: T[], key: keyof T, value: any): T | undefined {
  return array.find((item) => item[key] === value);
}


export function getActionName(action: EncountersAction): string {
  switch (action) {
    case EncountersAction.Fight:
      return "Fight";
    case EncountersAction.Pay:
      return "Pay";
    case EncountersAction.Run:
      return "Run";
    default:
      return "?"
  }
}


export function getOutcomeName(outcome: EncounterOutcomes): string {
  switch (outcome) {
    case EncounterOutcomes.Died:
      return "Died";
    case EncounterOutcomes.Escaped:
      return "Escaped";
    case EncounterOutcomes.Paid:
      return "Paid";
    case EncounterOutcomes.Victorious:
      return "Victorious";
    default:
      return "?"
  }
}




export function getOutcomeInfo(
  encounter: Encounters,
  type: EncounterOutcomes,
): OutcomeInfo {
  const found = outcomes.find((item) => {
    return item.encounter === encounter && item.type === type;
  });
  if (!found) {
    console.log(`getOutcomeInfo outcome ${encounter} ${type} not found !`);
  }
  return found || outcomes[0];
}


