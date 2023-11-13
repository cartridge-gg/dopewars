import { create } from "zustand";
import { Drug, Outcome, PlayerStatus } from "../dojo/types";

export type DrugType = {
  [key in Drug]: {
    quantity: number;
  };
};

export enum TradeDirection {
  Buy,
  Sell,
}

export type TradeType = {
  quantity: number;
  direction: TradeDirection;
  total: number;
};

export type Encounter = {
  status: PlayerStatus;
  outcome: Outcome;
};

export interface PlayerStore {
  encounters: Encounter[];
  lastEncounter: Encounter | null;
  trades: Map<Drug, TradeType>;
  addEncounter: (status: PlayerStatus, outcome: Outcome) => void;
  addTrade: (drug: Drug, trade: TradeType) => void;
  resetTurn: () => void;
  resetAll: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  encounters: [],
  lastEncounter: null,
  trades: new Map(),
  addEncounter: (status: PlayerStatus, outcome: Outcome) => {
    const encounter = { status, outcome };
    set((state) => ({
      encounters: [...state.encounters, encounter],
      lastEncounter: encounter,
    }));
  },
  addTrade: (drug: Drug, trade: TradeType) =>
    set((state) => {
      const existingTrade = state.trades.get(drug);

      if (!existingTrade) {
        state.trades.set(drug, trade);
        return { trades: new Map(state.trades) };
      }

      let quantity = existingTrade.quantity;
      let direction = existingTrade.direction;
      let total = existingTrade.total;

      // if the existing trade has the same direction, add quantities
      if (quantity === trade.direction) {
        quantity += trade.quantity;
        total += trade.total;
      } else {
        // if the existing trade has the opposite direction, subtract quantities
        quantity -= trade.quantity;
        total -= trade.total;

        // if negative quantity, reverse the direction and make the quantity positive
        if (quantity < 0) {
          quantity = -quantity;
          direction = trade.direction;
        }

        if (quantity === 0) {
          state.trades.delete(drug);
          return { trades: new Map(state.trades) };
        }
      }

      state.trades.set(drug, { quantity, direction, total });
      return { trades: new Map(state.trades) };
    }),
  resetTurn: () => {
    set({ trades: new Map(), lastEncounter: null });
  },
  resetAll: () => {
    set({ trades: new Map(), lastEncounter: null, encounters: [] });
  },
}));
