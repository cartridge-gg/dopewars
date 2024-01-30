
// must have same order than cairo enum
export enum Location {
  Home,
  Queens,
  Bronx,
  Brooklyn,
  Jersey,
  Central,
  Coney,
}

// must have same order than cairo enum
export enum Drug {
  Ludes,
  Speed,
  Weed,
  Acid,
  Heroin,
  Cocaine,
}

export enum ItemEnum {
  Attack,
  Defense,
  Transport,
  Speed,
}

export enum ItemTextEnum {
  Attack = "Attack",
  Defense= "Defense",
  Transport = "Transport",
  Speed = "Speed",
}

export enum PlayerStatus {
  Normal = "Normal",
  BeingMugged = "BeingMugged",
  BeingArrested = "BeingArrested",
  AtPawnshop = "AtPawnshop"
}

export enum Action {
  Run,
  Pay,
  Fight,
}

export enum Outcome {
  Died,
  Paid,
  Escaped,
  Captured,
  Victorious,
}

export enum GameMode {
  Test,
  Unlimited
}

export interface LocationInfo {
  type: Location;
  name: string;
  slug: string;
  id: string;
  icon: React.FC;
}

export interface DrugInfo {
  type: Drug;
  name: string;
  slug: string;
  id: string;
  icon: React.FC;
}

export interface ShopItemInfo {
  type: ItemEnum;
  typeText : ItemTextEnum;
  name: string;
  cost: number;
  value: number;
  id: string;
  level: number;
  icon: React.FC;
}

export interface OutcomeInfo {
  title: string;
  type: Outcome;
  status: PlayerStatus;
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
  Buy,
  Sell,
}