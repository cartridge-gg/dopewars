import { create } from "zustand";

export interface GameState {
  players: number;
  incPlayer: () => void;
  removePlayers: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: 0,
  incPlayer: () => set((state) => ({ players: state.players + 1 })),
  removePlayers: () => set({ players: 0 }),
}));
