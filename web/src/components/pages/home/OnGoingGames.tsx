import { Cigarette, Gem } from "@/components/icons";
import { useConfigStore, useRouterContext } from "@/dojo/hooks";
import { IsMobile } from "@/utils/ui";
import { Button } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
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
          <Button h="48px" variant="pixelated" onClick={() => router.push("/game/history")}>
            {onGoingGames.length} <Cigarette />
          </Button>
        </>
      )}
    </>
  );
};
