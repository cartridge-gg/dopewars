import { Text, HStack, Divider, Image } from "@chakra-ui/react";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Link } from "@/components/icons";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useEffect } from "react";
import { Location, PlayerStatus } from "@/dojo/types";
import { getLocationByType } from "@/dojo/helpers";
import { usePlayerStore } from "@/dojo/hooks/usePlayerStore";

export default function Redirector() {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { account } = useDojoContext();
  const { playerEntity }= usePlayerStore()

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
