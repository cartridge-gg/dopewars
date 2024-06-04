import { Layout } from "@/components/layout";
import { Loader } from "@/components/layout/Loader";
import { useGameStore, useRouterContext } from "@/dojo/hooks";
import { PlayerStatus } from "@/dojo/types";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const Redirector = observer(() => {
  const { router, gameId } = useRouterContext();

  const { account } = useAccount();

  const { game } = useGameStore();

  useEffect(() => {
    let handle: any = undefined;

    if (!game) {
      handle = setTimeout(() => {
        router.push(`/`);
      }, 2000);
    } else {
      clearTimeout(handle);

      if( game.gameInfos.game_over) {
        router.push(`/${gameId}/end`);
      } else
      if (game.player.status === PlayerStatus.Normal) {
        if (game.player.location) {
          router.push(`/${gameId}/${game.player.location.location}`);
        } else {
          router.push(`/${gameId}/travel`);
        }
      } else if (game.player.status === PlayerStatus.BeingArrested || game.player.status === PlayerStatus.BeingMugged) {
        //
        router.push(`/${gameId}/event/decision`);
      }
    }

    return () => clearTimeout(handle);
  }, [game, game?.player.status, game?.player.location, router, gameId]);

  return (
    <Layout isSinglePanel>
      <Loader />
    </Layout>
  );
});

export default Redirector;
