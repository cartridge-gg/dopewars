import { createContext, ReactNode, useContext, useMemo } from "react";
import { SetupResult } from "../setup/setup";

export const DojoContext = createContext<SetupResult | null>(null);

export const DojoProvider = ({ children, value }: {children: ReactNode, value: SetupResult}) => {
    const contextValue = useContext(DojoContext);
    if (contextValue) throw new Error("DojoProvider can only be used once");
    return <DojoContext.Provider value={value}>{children}</DojoContext.Provider>;
};

