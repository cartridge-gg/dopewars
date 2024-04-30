import { Cigarette, Gem } from "@/components/icons";
import { MakeItRain } from "@/components/layout";
import { useConfigStore, useHallOfFame, useRouterContext } from "@/dojo/hooks";
import { Game, Leaderboard } from "@/generated/graphql";
import { IsMobile } from "@/utils/ui";
import { Button } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { ClaimModal } from "./ClaimModal";
import { useGamesByPlayer } from "@/dojo/hooks/useGamesByPlayer";

export const OnGoingGames = () => {
  const { router } = useRouterContext();
  const { config } = useConfigStore();
  const { account } = useAccount();

  const { onGoingGames } = useGamesByPlayer(account?.address || "0x0");

  const isMobile = IsMobile();

  return (
    <>
      {onGoingGames.length > 0 && (
        <>
          <Button
            h="48px"
            variant="pixelated"
            // bg="yellow.600"
            // borderColor="yellow.600"
            // color="yellow.400"
            // _hover={{
            //   bg: "yellow.500",
            // }}
            onClick={() => router.push("/game/history")}
          >
            {onGoingGames.length} <Cigarette />
          </Button>
        </>
      )}
    </>
  );
};
