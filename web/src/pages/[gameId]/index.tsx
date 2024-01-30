import Layout from "@/components/Layout";
import { useConfigStore, useDojoContext, usePlayerStore, useRouterContext } from "@/dojo/hooks";
import { PlayerStatus } from "@/dojo/types";
import { Image } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Redirector() {
  const { router, gameId } = useRouterContext();

  const { account } = useDojoContext();
  const { playerEntity } = usePlayerStore();
  const configStore = useConfigStore()

  useEffect(() => {
    if (playerEntity?.status === PlayerStatus.Normal) {
      router.push(`/${gameId}/${configStore.getLocation(playerEntity!.locationId)?.location.toLowerCase()}`);
    } else if (playerEntity?.status === PlayerStatus.AtPawnshop) {
      router.push(`/${gameId}/pawnshop`);
    } else if (
      playerEntity?.status === PlayerStatus.BeingArrested ||
      playerEntity?.status === PlayerStatus.BeingMugged
    ) {
      //
      router.push(`/${gameId}/decision`);
    }
  }, [playerEntity, playerEntity?.status, playerEntity?.locationId, router, gameId]);

  return (
    <Layout isSinglePanel>
      <Image src="images/loading.gif" alt="loading" width="60px" height="60px" margin="auto" />
    </Layout>
  );
}
