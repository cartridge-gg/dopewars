
import { DojoContext } from "../context/DojoContext";
import { useContext } from "react";
import { PlayerStore } from "../stores/player";
import { useStore } from "zustand";

export const usePlayerStore = () : PlayerStore => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("usePlayerStore must be used within a DojoProvider");
  }
  return useStore<PlayerStore>(value.playerStore);
}

