// must have same order than cairo enum
export enum Locations {
  Home,
  Queens,
  Bronx,
  Brooklyn,
  Jersey,
  Central,
  Coney,
}

// must have same order than cairo enum
export enum Drugs {
  Ludes,
  Speed,
  Weed,
  Shrooms,
  Acid,
  Ketamine,
  Heroin,
  Cocaine,
}

export enum ItemEnum {
  Attack,
  Defense,
  Speed,
  Transport,
}

export enum ItemTextEnum {
  Attack = "Attack",
  Defense = "Defense",
  Speed = "Speed",
  Transport = "Transport",
}

export enum PlayerStatus {
  Normal,
  BeingArrested,
  BeingMugged,
}

export enum Encounters {
  Cops = "Cops",
  Gang = "Gang",
}

export enum EncountersAction {
  Run,
  Pay,
  Fight,
}

export enum EncounterOutcomes {
  Died,
  Paid,
  Escaped,
  Victorious,
  Jailed,
  Hospitalized,
}

export enum GameMode {
  Dealer,
  Warrior,
}

export interface LocationInfo {
  type: Locations;
  name: string;
  slug: string;
  id: string;
  icon: React.FC;
}

export interface DrugInfo {
  type: Drugs;
  name: string;
  slug: string;
  id: string;
  icon: React.FC;
}

export interface ShopItemInfo {
  type: ItemEnum;
  typeText: ItemTextEnum;
  name: string;
  cost: number;
  value: number;
  id: string;
  level: number;
  icon: React.FC;
}

export interface OutcomeInfo {
  title: string;
  encounterOutcome: EncounterOutcomes;
  encounter: Encounters;
  name: string;
  imageSrc: string;
  description?: string;
  getResponse: (isInitial: boolean) => string;
  color: string;
}

export type DrugMarket = {
  drug: string;
  drugId: number;
  price: number;
  weight: number;
};

export type LocationPrices = Map<string, DrugMarket[]>;

export enum TradeDirection {
  Sell,
  Buy,
}

export type TradeAction = {
  direction: TradeDirection;
  drug: Drugs;
  quantity: number;
};

export type ShopAction = {
  slot: number;
};

export enum ItemSlot {
  Weapon,
  Clothes,
  Feet,
  Transport,
}

//
//
//
export enum CashMode {
  Broke = "Broke",
  Average = "Average",
  Rich = "Rich",
}

export enum HealthMode {
  Junkie = "Junkie",
  Hustler = "Hustler",
  Streetboss = "Streetboss",
}

export enum TurnsMode {
  OnSpeed = "OnSpeed",
  OnWeed = "OnWeed",
  OnMush = "OnMush",
}

export enum EncountersMode {
  Chill = "Chill",
  NoJokes = "NoJokes",
  UltraViolence = "UltraViolence",
}

export enum EncountersOddsMode {
  Easy = "Easy",
  Normal = "Normal",
  Hard = "Hard",
}

export enum DrugsMode {
  Cheap = "Cheap",
  Normal = "Normal",
  Expensive = "Expensive",
}

export enum WantedMode {
  KoolAndTheGang = "KoolAndTheGang",
  ThugLife = "ThugLife",
  MostWanted = "MostWanted",
}
