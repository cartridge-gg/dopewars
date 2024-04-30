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
  Ketamine,
  Ludes,
  Shrooms,
  Speed,
  Weed,
} from "@/components/icons/drugs";

import { getCopResponses, getMuggerResponses } from "@/responses";
import {
  EncounterOutcomes,
  Encounters,
  EncountersAction,
  ItemSlot,
  OutcomeInfo
} from "./types";

import { Cigarette } from "@/components/icons";
import {
  AK47,
  BaseballBat,
  Boots,
  Kevlar,
  Leatherjacket,
  PlasticBag,
  Shirt,
  Shoes
} from "@/components/icons/items";
import { Chain } from "@/components/icons/items/Chain";
import { Shoes2 } from "@/components/icons/items/Shoes2";



export const encountersActionName = {
  [EncountersAction.Run] : "Run",
  [EncountersAction.Pay] : "Pay",
  [EncountersAction.Fight] : "Fight",
}
export type encountersActionNameKeys = keyof typeof encountersActionName;


export const randomGreetings = {
  0: "Welcome to",
  // 1: "GM",
  // 2: "Yo",
  // 3: "Sup",
  // 4: "Here we go again",
  // 5: "Ohayo",
}
export type randomGreetingsKeys = keyof typeof randomGreetings;


export const reputationRanks = {
  0: "Goon",
  1: "Hustler",
  2: "Streetboss",
  3: "OG",
  4: "Kingpin",
}
export type reputationRanksKeys = keyof typeof reputationRanks;

export const copsRanks = {
  1: "Grunt",
  2: "Sergeant",
  3: "Heavy",
  4: "Captain",
  5: "SWAT",
  6: "Mech",
}
export type copsRanksKeys = keyof typeof copsRanks;

export const gangRanks = {
  1: "Runner",
  2: "Goon",
  3: "Soldier",
  4: "Enforcer",
  5: "Underboss",
  6: "Big Boss",
}
export type gangRanksKeys = keyof typeof gangRanks;


export const itemUpgrades = {
  [ItemSlot.Weapon]: {
    0: {
      1: "Extended Mag",
      2: "Recoil Compensator",
      3: "Laser Sight",
    },
    1: {
      1: "Tactical Grip",
      2: "Reinforced Links",
      3: "Spiked End",
    },
    2: {
      1: "Grip Tape",
      2: "Corked Bat",
      3: "Aluminum Bat",
    }
  },
  [ItemSlot.Clothes]: {
    0: {
      1: "Reinforced Stitching",
      2: "Polyester Blend",
      3: "More Blood",
    },
    1: {
      1: "Shoulder Straps",
      2: "Thermal Ventilation",
      3: "Ceramic Plate Inserts",
    },
    2: {
      1: "Tailor Fitting",
      2: "Treated Leather",
      3: "Ballistic Inserts",
    }
  },
  [ItemSlot.Feet]: {
    0: {
      1: "Fresh Laces",
      2: "Ventilated Mesh",
      3: "Memory Foam Insoles",
    },
    1: {
      1: "Quick-Lace System",
      2: "Anti-Slip Outsoles",
      3: "Memory Foam Insoles",
    },
    2: {
      1: "Locking Laces",
      2: "Shock-Absorbing Insoles",
      3: "Steel-toed Cap",
    }
  },
  [ItemSlot.Transport]: {
    0: {
      1: "Fanny Pack",
      2: "Backpack",
      3: "Duffle Bag",
    }
  },
}

export const statName = {
  [ItemSlot.Weapon]: "ATK",
  [ItemSlot.Clothes]: "DEF",
  [ItemSlot.Feet]: "SPD",
  [ItemSlot.Transport]: "INV",
}
export type statNameKeys = keyof typeof statName;

export const slotName = {
  [ItemSlot.Weapon]: "WEAPON",
  [ItemSlot.Clothes]: "SHIRT",
  [ItemSlot.Feet]: "SHOES",
  [ItemSlot.Transport]: "BAG",
}
export type slotNameKeys = keyof typeof slotName;


export const locationIcons = {
  "Queens": Queens,
  "Bronx": Bronx,
  "Brooklyn": Brooklyn,
  "Jersey": Manhattan,
  "Central": CentralPark,
  "Coney": ConeyIsland,
}
export type locationIconsKeys = keyof typeof locationIcons;

export const drugIcons = {
  "Ludes": Ludes,
  "Speed": Speed,
  "Weed": Weed,
  "Shrooms": Shrooms,
  "Acid": Acid,
  "Ketamine": Ketamine,
  "Heroin": Heroin,
  "Cocaine": Cocaine,
}
export type drugIconsKeys = keyof typeof drugIcons;

export const itemIcons = {
  "Naked": Cigarette,
  //
  "AK47": AK47,
  "Chain": Chain,
  "Baseball Bat": BaseballBat,
  //
  "Blood-Stained Shirt": Shirt,
  "Bullet Proof Vest": Kevlar,
  "Trench Coat": Leatherjacket,
  //
  "All-Black Sneakers": Shoes,
  "Athletic Trainers": Shoes2,
  "Work Boots": Boots,
  //
  "Plastic bag": PlasticBag,
}
export type itemsIconsKeys = keyof typeof itemIcons;


// export const locations: LocationInfo[] = [
//   {
//     type: Locations.Queens,
//     name: "Queens",
//     slug: "queens",
//     id: "Queens",
//     icon: Queens,
//   },
//   {
//     type: Locations.Bronx,
//     name: "The Bronx",
//     slug: "bronx",
//     id: "Bronx",
//     icon: Bronx,
//   },
//   {
//     type: Locations.Brooklyn,
//     name: "Brooklyn",
//     slug: "brooklyn",
//     id: "Brooklyn",
//     icon: Brooklyn,
//   },
//   {
//     type: Locations.Jersey,
//     name: "Jersey City",
//     slug: "jersey",
//     id: "Jersey",
//     icon: Manhattan,
//   },
//   {
//     type: Locations.Central,
//     name: "Central Park",
//     slug: "central",
//     id: "Central",
//     icon: CentralPark,
//   },
//   {
//     type: Locations.Coney,
//     name: "Coney Island",
//     slug: "coney",
//     id: "Coney",
//     icon: ConeyIsland,
//   },
// ];

// const drugs: DrugInfo[] = [
//   {
//     type: Drugs.Ludes,
//     name: "Ludes",
//     slug: "ludes",
//     id: "Ludes",
//     icon: Ludes,
//   },
//   {
//     type: Drugs.Speed,
//     name: "Speed",
//     slug: "speed",
//     id: "Speed",
//     icon: Speed,
//   },
//   {
//     type: Drugs.Weed,
//     name: "Weed",
//     slug: "weed",
//     id: "Weed",
//     icon: Weed,
//   },
//   {
//     type: Drugs.Acid,
//     name: "Acid",
//     slug: "acid",
//     id: "Acid",
//     icon: Acid,
//   },
//   {
//     type: Drugs.Heroin,
//     name: "Heroin",
//     slug: "heroin",
//     id: "Heroin",
//     icon: Heroin,
//   },
//   {
//     type: Drugs.Cocaine,
//     name: "Cocaine",
//     slug: "cocaine",
//     id: "Cocaine",
//     icon: Cocaine,
//   },
// ];

export const outcomes: OutcomeInfo[] = [
  {
    title: "You",
    name: "Paid the Cop",
    encounterOutcome: EncounterOutcomes.Paid,
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
    encounterOutcome: EncounterOutcomes.Paid,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/paid.png",
    description: "You paid the gang off",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Paid, isInitial),
    color: "yellow.400",
  },
  {
    title: "You",
    name: "Escaped",
    encounterOutcome: EncounterOutcomes.Escaped,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Escaped, isInitial),
    description: "You escaped",
    color: "neon.200",
  },
  {
    title: "You",
    name: "Escaped",
    encounterOutcome: EncounterOutcomes.Escaped,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Escaped, isInitial),
    description: "You escaped",
    color: "neon.200",
  },
  {
    title: "You",
    name: "Got killed by the Cops",
    encounterOutcome: EncounterOutcomes.Died,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Died, isInitial),
    color: "red",
  },
  {
    title: "You",
    name: "Got killed by the Gang",
    encounterOutcome: EncounterOutcomes.Died,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Died, isInitial),
    color: "red",
  },
  {
    title: "You are",
    name: "Victorious!",
    encounterOutcome: EncounterOutcomes.Victorious,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/victorious.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Victorious, isInitial),
    color: "neon.200",
  },
  {
    title: "You are",
    name: "Victorious!",
    encounterOutcome: EncounterOutcomes.Victorious,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/victorious.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Victorious, isInitial),
    color: "neon.200",
  },
  {
    title: "You are",
    name: "Jailed!",
    encounterOutcome: EncounterOutcomes.Jailed,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/police_cruiser.gif",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Jailed, isInitial),
    color: "neon.200",
  },
  {
    title: "You are",
    name: "Hospitalized!",
    encounterOutcome: EncounterOutcomes.Hospitalized,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/hospital.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Hospitalized, isInitial),
    color: "neon.200",
  },

];


// function findBy<T>(array: T[], key: keyof T, value: any): T | undefined {
//   return array.find((item) => item[key] === value);
// }



export const outcomeNames = {
  [EncounterOutcomes.Died]: "Died",
  [EncounterOutcomes.Escaped]: "Escaped",
  [EncounterOutcomes.Paid]: "Paid",
  [EncounterOutcomes.Victorious]: "Victorious",
  [EncounterOutcomes.Jailed]: "Jailed",
  [EncounterOutcomes.Hospitalized]: "Hospitalized",
}
export type outcomeNamesKeys = keyof typeof outcomeNames;




export function getOutcomeInfo(
  encounter: Encounters,
  encounterOutcome: EncounterOutcomes,
): OutcomeInfo {
  const found = outcomes.find((i) => {
    return i.encounter === encounter && i.encounterOutcome === encounterOutcome;
  });
  if (!found) {
    console.log(`getOutcomeInfo outcome ${encounter} ${encounterOutcome} not found !`);
  }
  return found || outcomes[0];
}




export function getRandomGreeting(seed: number) {
  return randomGreetings[seed % Object.values(randomGreetings).length as randomGreetingsKeys]
}