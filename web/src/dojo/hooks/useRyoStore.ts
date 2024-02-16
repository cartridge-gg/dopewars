
import { useContext } from "react";
import { StoreApi, useStore } from "zustand";
import { DojoContext } from "../context/DojoContext";
import { RyoStore } from "../stores/ryo";


export const useRyoStore = () : RyoStore => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useRyoStore must be used within a DojoProvider");
  }
  return useStore<StoreApi<RyoStore>>(value.ryoStore);
}

