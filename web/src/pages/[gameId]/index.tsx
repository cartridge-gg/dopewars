import Layout from "@/components/Layout";
import { getLocationByType } from "@/dojo/helpers";
import { useDojoContext, usePlayerStore, useRouterContext } from "@/dojo/hooks";
import { PlayerStatus } from "@/dojo/types";
import { Image } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Redirector() {
  const { router, gameId } = useRouterContext();

  const { account } = useDojoContext();
  const { playerEntity } = usePlayerStore();

  useEffect(() => {
    if (playerEntity?.status === PlayerStatus.Normal) {
      router.push(`/${gameId}/${getLocationByType(Number(playerEntity!.locationId))?.slug}`);
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
