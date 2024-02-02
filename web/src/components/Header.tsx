import MediaPlayer from "@/components/MediaPlayer";
import MobileMenu from "@/components/MobileMenu";
import { useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { initSoundStore } from "@/hooks/sound";
import { headerStyles } from "@/theme/styles";
import { IsMobile, formatCashHeader } from "@/utils/ui";
import { Divider, Flex, HStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { ProfileLink } from "./ProfileButton";
import CashIndicator from "./player/CashIndicator";
import DayIndicator from "./player/DayIndicator";
import HealthIndicator from "./player/HealthIndicator";

export interface HeaderProps {
  back?: boolean;
}

const Header = ({ back }: HeaderProps) => {
  const isMobile = IsMobile();

  const { router, gameId } = useRouterContext();
  
  const {
    account,
    burner: { create: createBurner, isDeploying: isBurnerDeploying },
  } = useDojoContext();

  const { game } = useGameStore();

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
      <HStack flex="1" justify={["left", "right"]}></HStack>
      {game && (/*!game.gameOver ||*/ true || router.asPath.includes("logs")) && (
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
                <DayIndicator day={game.player.turn} />
                {/* <WantedIndicator wanted={playerEntity.wanted} /> */}
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
};

export default Header;
