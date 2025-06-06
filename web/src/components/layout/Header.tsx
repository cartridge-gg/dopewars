import { HeaderButton, MediaPlayer } from "@/components/layout";
import { useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { initSoundStore } from "@/hooks/sound";
import { headerStyles } from "@/theme/styles";
import { IsMobile, formatCashHeader } from "@/utils/ui";
import { Box, Button, Divider, Flex, HStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { ClaimReward } from "../pages/home";
import { ProfileLink } from "../pages/profile/Profile";
import { CashIndicator, DayIndicator, HealthIndicator } from "../player";
import { ConnectButton } from "../wallet/ConnectButton";

import DrawerMenu from "./DrawerMenu";
import { Cigarette, ExternalLink } from "../icons";

export const Header = observer(() => {
  const isMobile = IsMobile();

  const { router, gameId } = useRouterContext();

  const { account } = useAccount();

  const { uiStore } = useDojoContext();
  const { game, gameConfig } = useGameStore();

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
      py={["0", "16px"]}
      fontSize={["14px", "16px"]}
    >
      <HStack gap={3} flex="1">
        {!gameId && <ClaimReward />}
        {!gameId && !router.route.includes("/claim") && (
          <HeaderButton
            variant="pixelated"
            h={["40px", "48px"]}
            fontSize="14px"
            onClick={() => router.push("/claim")}
            mr={6}
            display="flex"
            flexDirection={"row"}
            alignItems="center"
            justifyContent="center"
            py={2}
          >
            <Cigarette mr="2"/> MIGRATION
          </HeaderButton>
        )}
      </HStack>

      {game /*|| router.asPath.includes("logs")*/ && (
        <HStack
          flex={["auto", 1]}
          justify="center"
          width={["100%", "auto"]}
          cursor="help"
          onClick={() => {
            uiStore.openSeasonDetails();
          }}
        >
          <HStack
            h={["40px", "48px"]}
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
                <HealthIndicator health={game.player.health} maxHealth={gameConfig?.health} />
                <Divider orientation="vertical" borderColor="neon.600" h="12px" />
                <DayIndicator day={game.player.turn} max={gameConfig?.max_turns} />
              </HStack>
            </Flex>
          </HStack>
        </HStack>
      )}

      <HStack flex="1" justify="right">
        {!isMobile && <ConnectButton />}
        {!isMobile && account && game && <ProfileLink />}

        {/* trick to allow autoplay.. */}
        <Box display="none">
          <MediaPlayer />
        </Box>

        <DrawerMenu />
      </HStack>
    </HStack>
  );
});
