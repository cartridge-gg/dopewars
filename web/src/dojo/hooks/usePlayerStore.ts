
import { useContext } from "react";
import { useStore } from "zustand";
import { DojoContext } from "../context/DojoContext";
import { PlayerStore } from "../stores/player";

export const usePlayerStore = () : PlayerStore => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("usePlayerStore must be used within a DojoProvider");
  }
  return useStore<PlayerStore>(value.playerStore);
}

