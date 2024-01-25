import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { usePlayerStore } from "@/hooks/player";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RegisterEntities = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { account } = useDojoContext();
  const playerStore = usePlayerStore();

  useEffect(() => {
    if (playerStore && gameId && account?.address) {
      console.log("Register PlayerEntity");
      playerStore.initPlayerEntity(gameId, account?.address);
    }

    if (!gameId) {
      playerStore.reset();
    }
  }, [gameId, account?.address ]);

  return <></>;
};

export default RegisterEntities;
