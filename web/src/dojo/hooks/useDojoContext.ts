import { DojoContext } from "../context/DojoContext";
import { useContext } from "react";

export const useDojoContext = () => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useDojoContext must be used within a DojoProvider");
  }
  return value;
};
