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
  Acid = "Acid",
  Weed = "Weed",
  Ludes = "Ludes",
  Speed = "Speed",
  Heroin = "Heroin",
  Cocaine = "Cocaine",
}

export type DrugsType = {
  [key in Drugs]: {
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

export enum Action {
  Pay,
  Run,
}

export enum Outcome {
  Paid,
  Escaped,
  Captured,
}

export interface PlayerStore {
  outcomes: Outcome[];
  trades: Map<Drugs, TradeType>;
  addOutcome: (outcome: Outcome) => void;
  addTrade: (drug: Drugs, trade: TradeType) => void;
  clearState: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  outcomes: [],
  trades: new Map(),
  addOutcome: (outcome: Outcome) =>
    set((state) => ({ outcomes: [...state.outcomes, outcome] })),
  addTrade: (drug: Drugs, trade: TradeType) =>
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
  clearState: () => set({ trades: new Map(), outcomes: [] }),
}));
