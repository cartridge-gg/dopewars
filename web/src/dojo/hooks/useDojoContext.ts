
import { useContext } from "react";
import { DojoContext } from "../context/DojoContext";

export const useDojoContext = () => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useDojoContext must be used within a DojoProvider");
  }
  return value;
}

