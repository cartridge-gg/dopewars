import { MediaPlayer, MobileMenu } from "@/components/layout";
import { Connect } from "@/components/wallet";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { initSoundStore } from "@/hooks/sound";
import { headerStyles } from "@/theme/styles";
import { IsMobile, formatCashHeader } from "@/utils/ui";
import { Divider, Flex, HStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { ClaimReward } from "../pages/home";
import { ProfileLink } from "../pages/profile/Profile";
import { CashIndicator, DayIndicator, HealthIndicator } from "../player";
import { ChainSelector } from "../wallet/ChainSelector";

interface HeaderProps {
  back?: boolean;
}

export const Header = observer(({ back }: HeaderProps) => {
  const isMobile = IsMobile();

  const { router, gameId } = useRouterContext();

  const {
    burner: { create: createBurner, isDeploying: isBurnerDeploying },
  } = useDojoContext();
  const { account } = useAccount();

  const { game, gameInfos } = useGameStore();
  const { config } = useConfigStore();

  useEffect(() => {
    const init = async () => {
      await initSoundStore();
    };
    init();
  }, []);

  return (
    <HStack
      w="full"
      px="10px"
      spacing="10px"
      zIndex="overlay"
      align="flex-start"
      py={["0", "20px"]}
      fontSize={["14px", "16px"]}
    >
      <HStack gap={3} flex="1" /*justify={["left", "right"]}*/>
        <Connect />
        <ChainSelector />

        {/* {!game && (
          <>
            {config?.ryo.paper_address && <TokenBalance address={account?.address} token={config?.ryo.paper_address} />}
            {account && <PaperFaucet />}
          </>
        )} */}

        {!gameId && <ClaimReward />}
      </HStack>

      {game && /*!game.gameOver ||*/ (true || router.asPath.includes("logs")) && (
        <HStack flex={["auto", 1]} justify="center" width={["100%", "auto"]}>
          <HStack
            h="48px"
            width={["100%", "auto"]}
            px="20px"
            spacing={["10px", "30px"]}
            bg="neon.700"
            sx={{ ...headerStyles }}
          >
            <Flex w="full" align="center" justify="center" gap="10px">
              <HStack>
                <CashIndicator cash={formatCashHeader(game.player.cash)} />
                <Divider orientation="vertical" borderColor="neon.600" h="12px" />
                <HealthIndicator health={game.player.health} maxHealth={100} />
                <Divider orientation="vertical" borderColor="neon.600" h="12px" />
                <DayIndicator day={game.player.turn} max={gameInfos?.max_turns} />
                {/* <WantedIndicator wanted={game.wanted.getValueByTick(game.player.wanted)} /> */}
              </HStack>
            </Flex>
          </HStack>
        </HStack>
      )}

      <HStack flex="1" justify="right">
        {!isMobile && (
          <>
            <MediaPlayer />
          </>
        )}

        {/* {!account && (
          <Button
            h="48px"
            sx={headerButtonStyles}
            isLoading={isBurnerDeploying}
            onClick={() => {
              if (!account) {
                createBurner();
              }
            }}
          >
            Create Burner
          </Button>
        )} */}

        {!isMobile && account && game && <ProfileLink />}
        {isMobile && <MobileMenu />}
      </HStack>
    </HStack>
  );
});
