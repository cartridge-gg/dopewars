
import { DojoContext } from "../context/DojoContext";
import { useContext } from "react";

export const useDojoContext = () => {
    const context = useContext(DojoContext);
    if (!context) {
      throw new Error("useDojoContext must be used within a DojoProvider");
    }
    return useContext(DojoContext);
}

  