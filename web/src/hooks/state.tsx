import { create } from "zustand";

export enum Locations {
  Queens = "Queens",
  Bronx = "The Bronx",
  Brooklyn = "Brooklyn",
  Coney = "Coney Island",
  Jersey = "Jersey City",
  Central = "Central Park",
}

export enum Drugs {
  Acid,
  Weed,
  Ludes,
  Speed,
  Heroin,
  Cocaine,
}

export type DrugsType = {
  [key in Drugs]: {
    quantity: number;
  };
};

export interface GameState {
  players: string[];
  inventory: {
    cash: number;
    drugs: DrugsType;
  };
  turnsLeft: number;
  location: Locations | undefined;
}

export const useGameStore = create<GameState>(() => ({
  players: [],
  location: undefined,
  turnsLeft: 0,
  inventory: {
    cash: 0,
    drugs: {
      [Drugs.Acid]: { quantity: 0 },
      [Drugs.Weed]: { quantity: 0 },
      [Drugs.Ludes]: { quantity: 0 },
      [Drugs.Speed]: { quantity: 0 },
      [Drugs.Heroin]: { quantity: 0 },
      [Drugs.Cocaine]: { quantity: 0 },
    },
  },
}));

export const updateLocation = (location: Locations) =>
  useGameStore.setState({ location });

export const updateDrug = (drug: Drugs, quantity: number) =>
  useGameStore.setState((state) => ({
    inventory: {
      ...state.inventory,
      drugs: {
        ...state.inventory.drugs,
        [drug]: {
          quantity: state.inventory.drugs[drug].quantity + quantity,
        },
      },
    },
  }));

export const updateCash = (amount: number) =>
  useGameStore.setState((state) => ({
    inventory: { ...state.inventory, cash: state.inventory.cash + amount },
  }));

export const addPlayer = (player: string) =>
  useGameStore.setState((state) => ({ players: [...state.players, player] }));

export const removePlayer = (player: string) =>
  useGameStore.setState((state) => ({
    players: state.players.filter((p) => p !== player),
  }));
