
import { useContext } from "react";
import { StoreApi, useStore } from "zustand";
import { DojoContext } from "../context/DojoContext";
import { GameStore } from "../stores/game";

export const useGameStore = () : GameStore => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useGameStore must be used within a DojoProvider");
  }
  return useStore<StoreApi<GameStore>>(value.gameStore);
}

