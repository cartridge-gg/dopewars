import { useConfigStore } from "@/dojo/hooks/useConfigStore";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { usePlayerStore } from "@/dojo/hooks/usePlayerStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RegisterEntities = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

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
