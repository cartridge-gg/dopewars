import { editComponents } from "./../components/pages/admin/tables";
import { Bronx, Brooklyn, CentralPark, ConeyIsland, Manhattan, Queens } from "@/components/icons/locations";

import { Acid, Cocaine, Heroin, Ketamine, Ludes, Shrooms, Speed, Weed } from "@/components/icons/drugs";

import { getCopResponses, getMuggerResponses } from "@/responses";
import {
  CashMode,
  DrugsMode,
  EncounterOutcomes,
  Encounters,
  EncountersAction,
  EncountersMode,
  EncountersOddsMode,
  GameMode,
  HealthMode,
  ItemSlot,
  OutcomeInfo,
  TurnsMode,
  WantedMode,
} from "./types";

import { Cigarette } from "@/components/icons";
import { AK47, BaseballBat, Boots, Kevlar, Leatherjacket, PlasticBag, Shirt, Shoes } from "@/components/icons/items";
import { Chain } from "@/components/icons/items/Chain";
import { Shoes2 } from "@/components/icons/items/Shoes2";
import colors from "@/theme/colors";

export const gameModeName = {
  [GameMode.Ranked]: "Ranked",
  [GameMode.Noob]: "Guest",
  [GameMode.Warrior]: "Warrior",
};
export type gameModeNameKeys = keyof typeof gameModeName;

export const gameModeFromName = {
  Ranked: GameMode.Ranked,
  Guest: GameMode.Noob,
  Warrior: GameMode.Warrior,
};
export type gameModeFromNameKeys = keyof typeof gameModeFromName;

export const encountersActionName = {
  [EncountersAction.Run]: "Run",
  [EncountersAction.Pay]: "Pay",
  [EncountersAction.Fight]: "Fight",
};
export type encountersActionNameKeys = keyof typeof encountersActionName;

export const randomGreetings = {
  0: "Welcome to",
  // 1: "GM",
  // 2: "Yo",
  // 3: "Sup",
  // 4: "Here we go again",
  // 5: "Ohayo",
};
export type randomGreetingsKeys = keyof typeof randomGreetings;

export const reputationRanks = {
  0: "Goon",
  1: "Hustler",
  2: "Streetboss",
  3: "OG",
  4: "Kingpin",
};
export type reputationRanksKeys = keyof typeof reputationRanks;

export const copsRanks = {
  1: "Grunt",
  2: "Sergeant",
  3: "Heavy",
  4: "Captain",
  5: "SWAT",
  6: "Mech",
};
export type copsRanksKeys = keyof typeof copsRanks;

export const gangRanks = {
  1: "Runner",
  2: "Goon",
  3: "Soldier",
  4: "Enforcer",
  5: "Underboss",
  6: "Big Boss",
};
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
    },
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
    },
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
    },
  },
  [ItemSlot.Transport]: {
    0: {
      1: "Fanny Pack",
      2: "Backpack",
      3: "Duffle Bag",
    },
  },
};

export const statName = {
  [ItemSlot.Weapon]: "ATK",
  [ItemSlot.Clothes]: "DEF",
  [ItemSlot.Feet]: "SPD",
  [ItemSlot.Transport]: "INV",
};
export type statNameKeys = keyof typeof statName;

export const slotName = {
  [ItemSlot.Weapon]: "WEAPON",
  [ItemSlot.Clothes]: "SHIRT",
  [ItemSlot.Feet]: "SHOES",
  [ItemSlot.Transport]: "BAG",
};
export type slotNameKeys = keyof typeof slotName;

export const locationIcons = {
  Queens: Queens,
  Bronx: Bronx,
  Brooklyn: Brooklyn,
  Jersey: Manhattan,
  Central: CentralPark,
  Coney: ConeyIsland,
};
export type locationIconsKeys = keyof typeof locationIcons;

export const drugIcons = {
  Ludes: Ludes,
  Speed: Speed,
  Weed: Weed,
  Shrooms: Shrooms,
  Acid: Acid,
  Ketamine: Ketamine,
  Heroin: Heroin,
  Cocaine: Cocaine,
};
export type drugIconsKeys = keyof typeof drugIcons;

export const itemIcons = {
  Naked: Cigarette,
  //
  AK47: AK47,
  Chain: Chain,
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
};
export type itemsIconsKeys = keyof typeof itemIcons;

export const outcomes: OutcomeInfo[] = [
  {
    title: "You",
    name: "Paid the Cop",
    encounterOutcome: "Paid",
    encounter: Encounters.Cops,
    imageSrc: "/images/events/paid.png",
    description: "You paid the cop off",
    getResponse: (isInitial: boolean) => getCopResponses(EncounterOutcomes.Paid, isInitial),
    color: "yellow.400",
  },
  {
    title: "You",
    name: "Paid the Gang",
    encounterOutcome: "Paid",
    encounter: Encounters.Gang,
    imageSrc: "/images/events/paid.png",
    description: "You paid the gang off",
    getResponse: (isInitial: boolean) => getMuggerResponses(EncounterOutcomes.Paid, isInitial),
    color: "yellow.400",
  },
  {
    title: "You",
    name: "Escaped",
    encounterOutcome: "Escaped",
    encounter: Encounters.Cops,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) => getCopResponses(EncounterOutcomes.Escaped, isInitial),
    description: "You escaped",
    color: "neon.200",
  },
  {
    title: "You",
    name: "Escaped",
    encounterOutcome: "Escaped",
    encounter: Encounters.Gang,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) => getMuggerResponses(EncounterOutcomes.Escaped, isInitial),
    description: "You escaped",
    color: "neon.200",
  },
  {
    title: "You",
    name: "Got killed by the Cops",
    encounterOutcome: "Died",
    encounter: Encounters.Cops,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) => getCopResponses(EncounterOutcomes.Died, isInitial),
    color: "red",
  },
  {
    title: "You",
    name: "Got killed by the Gang",
    encounterOutcome: "Died",
    encounter: Encounters.Gang,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) => getMuggerResponses(EncounterOutcomes.Died, isInitial),
    color: "red",
  },
  {
    title: "You are",
    name: "Victorious!",
    encounterOutcome: "Victorious",
    encounter: Encounters.Cops,
    imageSrc: "/images/events/victorious.png",
    getResponse: (isInitial: boolean) => getCopResponses(EncounterOutcomes.Victorious, isInitial),
    color: "neon.200",
  },
  {
    title: "You are",
    name: "Victorious!",
    encounterOutcome: "Victorious",
    encounter: Encounters.Gang,
    imageSrc: "/images/events/victorious.png",
    getResponse: (isInitial: boolean) => getMuggerResponses(EncounterOutcomes.Victorious, isInitial),
    color: "neon.200",
  },
  {
    title: "You are",
    name: "Jailed!",
    encounterOutcome: "Jailed",
    encounter: Encounters.Cops,
    imageSrc: "/images/events/police_cruiser.gif",
    getResponse: (isInitial: boolean) => getCopResponses(EncounterOutcomes.Jailed, isInitial),
    color: "neon.200",
  },
  {
    title: "You are",
    name: "Hospitalized!",
    encounterOutcome: "Hospitalized",
    encounter: Encounters.Gang,
    imageSrc: "/images/events/hospital.png",
    getResponse: (isInitial: boolean) => getMuggerResponses(EncounterOutcomes.Hospitalized, isInitial),
    color: "neon.200",
  },
];

export const outcomeNames = {
  [EncounterOutcomes.Died]: "Died",
  [EncounterOutcomes.Escaped]: "Escaped",
  [EncounterOutcomes.Paid]: "Paid",
  [EncounterOutcomes.Victorious]: "Victorious",
  [EncounterOutcomes.Jailed]: "Jailed",
  [EncounterOutcomes.Hospitalized]: "Hospitalized",
};
export type outcomeNamesKeys = keyof typeof outcomeNames;

export function getOutcomeInfo(encounter: Encounters, encounterOutcome: string): OutcomeInfo {
  const found = outcomes.find((i) => {
    return i.encounter === encounter && i.encounterOutcome === encounterOutcome;
  });
  if (!found) {
    console.log(`getOutcomeInfo outcome ${encounter} ${encounterOutcome} not found !`);
  }
  return found || outcomes[0];
}

export function getRandomGreeting(seed: number) {
  return randomGreetings[(seed % Object.values(randomGreetings).length) as randomGreetingsKeys];
}

//
// Season settings
//

export const cashModeColor = {
  [CashMode.Broke]: colors.red,
  [CashMode.Average]: colors.yellow["400"],
  [CashMode.Rich]: colors.neon["400"],
};
export type cashModeColorKeys = keyof typeof cashModeColor;

export const healthModeColor = {
  [HealthMode.Junkie]: colors.red,
  [HealthMode.Hustler]: colors.yellow["400"],
  [HealthMode.Streetboss]: colors.neon["400"],
};
export type healthModeColorKeys = keyof typeof healthModeColor;

export const turnsModeColor = {
  [TurnsMode.OnMush]: colors.red,
  [TurnsMode.OnWeed]: colors.yellow["400"],
  [TurnsMode.OnSpeed]: colors.neon["400"],
};
export type turnsModeColorKeys = keyof typeof turnsModeColor;

export const encountersModeColor = {
  [EncountersMode.UltraViolence]: colors.red,
  [EncountersMode.NoJokes]: colors.yellow["400"],
  [EncountersMode.Chill]: colors.neon["400"],
};
export type encountersModeColorKeys = keyof typeof encountersModeColor;

export const encountersModeOddsColor = {
  [EncountersOddsMode.Hard]: colors.red,
  [EncountersOddsMode.Normal]: colors.yellow["400"],
  [EncountersOddsMode.Easy]: colors.neon["400"],
};
export type encountersModeOddsColorKeys = keyof typeof encountersModeOddsColor;

export const drugsModeColor = {
  [DrugsMode.Expensive]: colors.red,
  [DrugsMode.Normal]: colors.yellow["400"],
  [DrugsMode.Cheap]: colors.neon["400"],
};
export type drugsModeColorKeys = keyof typeof drugsModeColor;

export const wantedModeColor = {
  [WantedMode.MostWanted]: colors.red,
  [WantedMode.ThugLife]: colors.yellow["400"],
  [WantedMode.KoolAndTheGang]: colors.neon["400"],
};
export type wantedModeColorKeys = keyof typeof wantedModeColor;

export function getPayedCount(entrants: number): number {
  if (entrants <= 2) {
    return 1; // payout_0_2(rank)
  } else if (entrants <= 10) {
    return 2; // payout_3_10(rank)
  } else if (entrants <= 30) {
    return 3; // payout_11_30(rank)
  } else if (entrants <= 50) {
    return 5; // payout_31_50(rank)
  } else if (entrants <= 75) {
    return 8; //payout_51_75(rank)
  } else if (entrants <= 100) {
    return 10; // payout_76_100(rank)
  } else if (entrants <= 150) {
    return 15; // payout_101_150(rank)
  } else if (entrants <= 200) {
    return 20; // payout_151_200(rank)
  } else if (entrants <= 250) {
    return 25; // payout_201_250(rank)
  } else if (entrants <= 300) {
    return 30; // payout_251_300(rank)
  } else if (entrants <= 350) {
    return 35; // payout_301_350(rank)
  } else if (entrants <= 400) {
    return 40; // payout_351_400(rank)
  } else if (entrants <= 500) {
    return 50; // payout_401_500(rank)
  } else {
    return 60; // payout_501_700(rank)
  }
}

//
//  payout count
//
