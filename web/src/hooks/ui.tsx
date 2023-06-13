import { create } from "zustand";

export interface UiState {
  isConnected: boolean;
}

export const useUiStore = create<UiState>(() => ({
  isConnected: false,
}));

export const setIsConnected = (isConnected: boolean) =>
  useUiStore.setState((state) => ({ isConnected }));
