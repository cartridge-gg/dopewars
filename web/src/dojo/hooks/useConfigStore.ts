
import { useContext } from "react";
import { DojoContext } from "../context/DojoContext";
import { ConfigStoreClass } from "../stores/config";

export const useConfigStore = (): ConfigStoreClass => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useConfigStore must be used within a DojoProvider");
  }
  return value.configStore
}

