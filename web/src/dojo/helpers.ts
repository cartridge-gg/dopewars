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
  Action,
  Drug,
  DrugInfo,
  DrugMarket,
  ItemEnum,
  ItemTextEnum,
  Location,
  LocationInfo,
  Outcome,
  OutcomeInfo,
  PlayerStatus,
  ShopItemInfo
} from "./types";
import { getMuggerResponses, getCopResponses, getGoblinResponses } from "@/responses";

import {
  Trenchcoat,
  Kevlar,
  Shoes,
  Glock,
  Knife,
  Uzi,
  Backpack,
  Bicycle,
  Dufflebag,
  Fannypack,
  Kneepads,
  Leatherjacket,
  Skateboard,
} from "@/components/icons/items";
import { Siren, Truck } from "@/components/icons";
import { ToastType } from "@/hooks/toast";

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
    title: "You",
    name: "Paid the Cop",
    type: Outcome.Paid,
    status: PlayerStatus.BeingArrested,
    imageSrc: "/images/events/paid.png",
    description: "You paid the cop off",
    getResponse: (isInitial: boolean) =>
      getCopResponses(Outcome.Paid, isInitial),
    color: "yellow.400",
  },
  {
    title: "You",
    name: "Paid the Gang",
    type: Outcome.Paid,
    status: PlayerStatus.BeingMugged,
    imageSrc: "/images/events/paid.png",
    description: "You paid the gang off",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Paid, isInitial),
    color: "neon.200",
  },
  {
    title: "You",
    name: "Escaped",
    type: Outcome.Escaped,
    status: PlayerStatus.BeingArrested,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(Outcome.Escaped, isInitial),
    description: "You fled to a random location",
    color: "neon.200",
  },
  {
    title: "You",
    name: "Escaped",
    type: Outcome.Escaped,
    status: PlayerStatus.BeingMugged,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Escaped, isInitial),
    description: "You fled to a random location",
    color: "neon.200",
  },
  {
    title: "You",
    name: "Got killed by the Cops",
    type: Outcome.Died,
    status: PlayerStatus.BeingArrested,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(Outcome.Died, isInitial),
    color: "red",
  },
  {
    title: "You",
    name: "Got killed by the Gang",
    type: Outcome.Died,
    status: PlayerStatus.BeingMugged,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Died, isInitial),
    color: "red",
  },
  {
    title: "You are",
    name: "Victorious!",
    type: Outcome.Victorious,
    status: PlayerStatus.BeingArrested,
    imageSrc: "/images/events/victorious.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(Outcome.Victorious, isInitial),
    color: "neon.200",
  },
  {
    title: "You are",
    name: "Victorious!",
    type: Outcome.Victorious,
    status: PlayerStatus.BeingMugged,
    imageSrc: "/images/events/victorious.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(Outcome.Victorious, isInitial),
    color: "neon.200",
  },
  {
    title: "You",
    name: "Took the mushrooms!",
    type: Outcome.Drugged,
    status: PlayerStatus.BeingDrugged,
    imageSrc: "/images/events/duende-drug.gif", //update
    description: "Have fun!",
    getResponse: (isInitial: boolean) =>
      getGoblinResponses(Outcome.Drugged, isInitial),
    color: "yellow.400",
  },
  {
    title: "You",
    name: "Declined the trip!",
    type: Outcome.Escaped,
    status: PlayerStatus.Normal,
    imageSrc: "/images/events/duende-drug.gif",
    description: "Boring!",
    getResponse: (isInitial: boolean) =>
      getGoblinResponses(Outcome.Escaped, isInitial),
    color: "yellow.400",
  },
];



export const shopItemInfos: ShopItemInfo[] = [
  // attack 
  {
    id: ItemTextEnum.Attack,
    typeText: ItemTextEnum.Attack,
    type: ItemEnum.Attack,
    level: 1,
    icon: Knife,
    value: 0,
    name: "Knife",
    cost: 0,
  },
  {
    id: ItemTextEnum.Attack,
    typeText: ItemTextEnum.Attack,
    type: ItemEnum.Attack,
    level: 2,
    icon: Glock,
    value: 0,
    name: "Glock",
    cost: 0,
  },
  {
    id: ItemTextEnum.Attack,
    typeText: ItemTextEnum.Attack,
    type: ItemEnum.Attack,
    level: 3,
    icon: Uzi,
    value: 0,
    name: "Uzi",
    cost: 0,
  },

  // transport 
  {
    id: ItemTextEnum.Transport,
    typeText: ItemTextEnum.Transport,
    type: ItemEnum.Transport,
    level: 1,
    icon: Fannypack,
    value: 0,
    name: "Fanny Pack",
    cost: 0,
  },
  {
    id: ItemTextEnum.Transport,
    typeText: ItemTextEnum.Transport,
    type: ItemEnum.Transport,
    level: 2,
    icon: Backpack,
    value: 0,
    name: "Backpack",
    cost: 0,
  },
  {
    id: ItemTextEnum.Transport,
    typeText: ItemTextEnum.Transport,
    type: ItemEnum.Transport,
    level: 3,
    icon: Dufflebag,
    value: 0,
    name: "Duffle Bag",
    cost: 0,
  },

  // defense 
  {
    id: ItemTextEnum.Defense,
    typeText: ItemTextEnum.Defense,
    type: ItemEnum.Defense,
    level: 1,
    icon: Kneepads,
    value: 0,
    name: "Knee Pads",
    cost: 0,
  },
  {
    id: ItemTextEnum.Defense,
    typeText: ItemTextEnum.Defense,
    type: ItemEnum.Defense,
    level: 2,
    icon: Leatherjacket,
    value: 0,
    name: "Leather Jacket",
    cost: 0,
  },
  {
    id: ItemTextEnum.Defense,
    typeText: ItemTextEnum.Defense,
    type: ItemEnum.Defense,
    level: 3,
    icon: Kevlar,
    value: 0,
    name: "Kevlar",
    cost: 0,
  },
  // speed 
  {
    id: ItemTextEnum.Speed,
    typeText: ItemTextEnum.Speed,
    type: ItemEnum.Speed,
    level: 1,
    icon: Shoes,
    value: 0,
    name: "Shoes",
    cost: 0,
  },
  {
    id: ItemTextEnum.Speed,
    typeText: ItemTextEnum.Speed,
    type: ItemEnum.Speed,
    level: 2,
    icon: Skateboard,
    value: 0,
    name: "Skateboard",
    cost: 0,
  },
  {
    id: ItemTextEnum.Speed,
    typeText: ItemTextEnum.Speed,
    type: ItemEnum.Speed,
    level: 3,
    icon: Bicycle,
    value: 0,
    name: "Bicycle",
    cost: 0,
  },
]

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

export function getShopItem(id: ItemTextEnum, level: number): ShopItemInfo {
  const item = shopItemInfos.find(i => i.id === id && i.level === level);
  if (!item) {
    throw Error('item not found!');
  }
  return item;
}

export function getShopItemByType(type: ItemEnum, level: number): ShopItemInfo {
  const item = shopItemInfos.find(i => i.type == type && i.level === level);
  if (!item) {
    throw Error('item not found!');
  }
  return item;
}

export function getActionName(action: Action): string {
  switch (action) {
    case Action.Fight:
      return "Fight";
    case Action.Pay:
      return "Pay";
    case Action.Run:
      return "Run";
    case Action.Accept:
      return "Accept";
    case Action.Decline:
      return "Decline";
    default:
      return "?"
  }
}


export function getOutcomeName(outcome: Outcome): string {
  switch (outcome) {
    case Outcome.Captured:
      return "Captured";
    case Outcome.Died:
      return "Died";
    case Outcome.Escaped:
      return "Escaped";
    case Outcome.Paid:
      return "Paid";
    case Outcome.Victorious:
      return "Victorious";
    case Outcome.Drugged:
      return "Drugged";
    default:
      return  "?"
  }
}


export function getShopItemStatname(typ: ItemTextEnum): string {
  switch (typ) {
    case ItemTextEnum.Attack:
      return "ATK"
    case ItemTextEnum.Defense:
      return "DEF"
    case ItemTextEnum.Transport:
      return "INV"
    case ItemTextEnum.Speed:
      return "SPD"
    default:
      return "?"
  }
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


