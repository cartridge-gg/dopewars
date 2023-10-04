import { Market } from "@/generated/graphql";

export enum Location {
  Queens,
  Bronx,
  Brooklyn,
  Coney,
  Jersey,
  Central,
}

export enum Drug {
  Acid,
  Weed,
  Ludes,
  Speed,
  Heroin,
  Cocaine,
}

export enum PlayerStatus {
  Normal,
  BeingMugged,
  BeingArrested,
}

export enum Action {
  Run,
  Pay,
}

export enum Outcome {
  Died,
  Paid,
  Escaped,
  Captured,
}

export enum GameMode{
  Limited,
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

export interface OutcomeInfo {
  type: Outcome;
  status: PlayerStatus;
  name: string;
  imageSrc: string;
  description?: string;
  getResponse: (isInitial: boolean) => string;
  color: string;
}

export type DrugMarket = {
  id: string; // id is hex encoded drug name
  price: number;
  marketPool: Market;
};

export type LocationPrices = Map<string, DrugMarket[]>;
