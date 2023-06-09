import { create } from "zustand";

export interface UiState {
  isConnected: boolean;
}

export const useUiStore = create<UiState>(() => ({
  isConnected: false,
}));

export const setIsConnected = (isConnected) =>
  useUiStore.setState((state) => ({ isConnected }));
