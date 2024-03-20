import { Layout } from "@/components/layout";
import { useGameStore, useRouterContext } from "@/dojo/hooks";
import { PlayerStatus } from "@/dojo/types";
import { Image } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useEffect } from "react";

export default function Redirector() {
  const { router, gameId } = useRouterContext();

  const { account } = useAccount();
  
  const { game } = useGameStore();

  useEffect(() => {
    if (!game) return;

    if (game.player.status === PlayerStatus.Normal) {
      router.push(`/${gameId}/${game.player.location.location}`);
    } else if (
      game.player.status ===PlayerStatus.BeingArrested ||
      game.player.status === PlayerStatus.BeingMugged
    ) {
      //
      router.push(`/${gameId}/event/decision`);
    }
  }, [game, game?.player.status, game?.player.location, router, gameId]);

  return (
    <Layout isSinglePanel>
      <Image src="images/loading.gif" alt="loading" width="60px" height="60px" margin="auto" />
    </Layout>
  );
}
