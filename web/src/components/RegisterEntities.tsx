import { useConfigStore, useDojoContext, useRouterContext } from "@/dojo/hooks";
import { useGameStore } from "@/dojo/hooks/useGameStore";
import { useEffect } from "react";

const RegisterEntities = () => {
  const { gameId } = useRouterContext();

  const { account } = useDojoContext();
  const configStore = useConfigStore();
  const gameStore = useGameStore();

  useEffect(() => {
    configStore && configStore.init();

    if (gameStore) {
      if (gameId && account?.address) {
        gameStore.init(gameId, account?.address);
      }

      if (!gameId) {
        gameStore.reset();
      }
    }
  }, [gameId, account?.address]);

  return <></>;
};

export default RegisterEntities;
