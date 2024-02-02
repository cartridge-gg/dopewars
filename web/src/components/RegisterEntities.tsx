import { useConfigStore, useDojoContext, usePlayerStore, useRouterContext } from "@/dojo/hooks";
import { useGameStore } from "@/dojo/hooks/useGameStore";
import { useEffect } from "react";

const RegisterEntities = () => {
  const { gameId } = useRouterContext();

  const { account } = useDojoContext();
  const playerStore = usePlayerStore();
  const configStore = useConfigStore();
  const gameStore = useGameStore();

  useEffect(() => {
    configStore && configStore.init();

    if (playerStore) {
      if (gameId && account?.address) {
        playerStore.initPlayerEntity(gameId, account?.address);
      }

      if (gameId && account?.address) {
        gameStore.init(gameId, account?.address);
      }

      if (!gameId) {
        playerStore.reset();
        gameStore.reset();
      }
    }
  }, [gameId, account?.address]);

  return <></>;
};

export default RegisterEntities;
