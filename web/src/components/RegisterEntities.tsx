import { useConfigStore, useDojoContext, usePlayerStore, useRouterContext } from "@/dojo/hooks";
import { useEffect } from "react";

const RegisterEntities = () => {
  const { gameId } = useRouterContext();

  const { account } = useDojoContext();
  const playerStore = usePlayerStore();
  const configStore = useConfigStore();

  useEffect(() => {
    configStore && configStore.init();

    if (playerStore) {
      if (gameId && account?.address) {
        console.log("Register PlayerEntity");
        playerStore.initPlayerEntity(gameId, account?.address);
      }

      if (!gameId) {
        playerStore.reset();
      }
    }
  }, [gameId, account?.address]);

  return <></>;
};

export default RegisterEntities;
