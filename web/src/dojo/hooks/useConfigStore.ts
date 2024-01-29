
import { useContext } from "react";
import { StoreApi, useStore } from "zustand";
import { DojoContext } from "../context/DojoContext";
import { ConfigStore } from "../stores/config";

export const useConfigStore = () : ConfigStore => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useConfigStore must be used within a DojoProvider");
  }
  return useStore<StoreApi<ConfigStore>>(value.configStore);
}

