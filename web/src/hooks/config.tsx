import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Storage from "@/utils/storage";

interface GameConfigInterface {
  nsfw: boolean;
  setNsfw: (value: boolean) => void;
}

const GameConfigContext = createContext<GameConfigInterface | undefined>(
  undefined,
);

export function GameConfigProvider({ children }: { children: ReactNode }) {
  const [nsfw, setNsfw] = useState<boolean>(false);

  useEffect(() => {
    setNsfw(Storage.get("nsfw") || false);
  }, []);

  useEffect(() => Storage.set("nsfw", nsfw), [nsfw]);

  return (
    <GameConfigContext.Provider value={{ nsfw, setNsfw }}>
      {children}
    </GameConfigContext.Provider>
  );
}

export const useGameConfig = (): GameConfigInterface => {
  const context = useContext(GameConfigContext);
  if (!context) {
    throw new Error("useGameConfig must be used within GameConfigProvider");
  }

  return context;
};
