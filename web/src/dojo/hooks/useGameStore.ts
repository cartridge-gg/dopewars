import { useContext } from "react";
import { DojoContext } from "../context/DojoContext";
import { GameStoreClass } from "../stores/game";

export const useGameStore = (): GameStoreClass => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useGameStore must be used within a DojoProvider");
  }
  return value.gameStore;
};
