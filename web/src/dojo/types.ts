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
  Ranked,
  Noob,
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
  encounterOutcome: string; //EncounterOutcomes;
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

// Game Token Types
export interface GameTokenData {
  game_id: number | undefined;
  game_over: boolean | undefined;
  lifecycle: {
    start: number | undefined;
    end: number | undefined;
  };
  minted_at: number | undefined;
  minted_by: number | undefined;
  minted_by_address: string | undefined;
  owner: string | undefined;
  settings_id: number | undefined;
  soulbound: boolean | undefined;
  completed_all_objectives: boolean | undefined;
  token_id: number;
  player_name: string | undefined;
  metadata: any | undefined;
  context: {
    name: string;
    description: string;
    contexts: any;
  } | undefined;
  settings: {
    name: string;
    description: string;
    data: any;
  } | undefined;
  score: number;
  objective_ids: string[];
  renderer: string | undefined;
  client_url: string | undefined;
  gameMetadata: {
    game_id: number;
    contract_address: string;
    name: string;
    description: string;
    developer: string;
    publisher: string;
    genre: string;
    image: string;
    color?: string;
    client_url?: string;
    renderer_address?: string;
  } | undefined;
}

export interface EnrichedGame {
  season_version: number;
  game_id: number;
  player_id: string;
  player_name: string;
  game_mode: string;
  game_over: number;
  final_score: number;
  token_id_type: string;
  token_id: number;
  "token_id.guestlootid": string | null;
  "token_id.lootid": string | null;
  "token_id.hustlerid": string | null;
  minigame_token_id: number;
  equipment_by_slot: string;
  minted_by?: number;
  lifecycle?: {
    start: number | undefined;
    end: number | undefined;
  };
}
