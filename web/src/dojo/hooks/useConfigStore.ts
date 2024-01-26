
import { DojoContext } from "../context/DojoContext";
import { useContext } from "react";
import { ConfigStore } from "../stores/config";
import { useStore } from "zustand";

export const useConfigStore = () : ConfigStore => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useConfigStore must be used within a DojoProvider");
  }
  return useStore<ConfigStore>(value.configStore);
}

