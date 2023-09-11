import { create } from "zustand";
import { Drug, Outcome } from "../dojo/types";

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
};

export interface PlayerStore {
  outcomes: Outcome[];
  history: Outcome[];
  trades: Map<Drug, TradeType>;
  addOutcome: (outcome: Outcome) => void;
  addTrade: (drug: Drug, trade: TradeType) => void;
  clearTradesAndOutcomes: () => void;
  clearAll: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  outcomes: [],
  history: [],
  trades: new Map(),
  addOutcome: (outcome: Outcome) =>
    set((state) => ({
      outcomes: [...state.outcomes, outcome],
      history: [...state.history, outcome],
    })),
  addTrade: (drug: Drug, trade: TradeType) =>
    set((state) => {
      const existingTrade = state.trades.get(drug);

      if (!existingTrade) {
        state.trades.set(drug, trade);
        return { trades: new Map(state.trades) };
      }

      let quantity = existingTrade.quantity;
      let direction = existingTrade.direction;

      // if the existing trade has the same direction, add quantities
      if (quantity === trade.direction) {
        quantity += trade.quantity;
      } else {
        // if the existing trade has the opposite direction, subtract quantities
        quantity -= trade.quantity;

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

      state.trades.set(drug, { quantity, direction });
      return { trades: new Map(state.trades) };
    }),
  clearTradesAndOutcomes: () => {
    set({ trades: new Map(), outcomes: [] });
  },
  clearAll: () => {
    set({ trades: new Map(), outcomes: [], history: [] });
  },
}));
