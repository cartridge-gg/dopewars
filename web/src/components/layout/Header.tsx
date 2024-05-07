import { MediaPlayer, MobileMenu } from "@/components/layout";
import { useConfigStore, useGameStore, useRouterContext } from "@/dojo/hooks";
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
import { Burners } from "../wallet/Burners";
import { ChainSelector } from "../wallet/ChainSelector";
import { ConnectButton } from "../wallet/ConnectButton";
import { Predeployed } from "../wallet/Predeployed";
import { OnGoingGames } from "../pages/home/OnGoingGames";
import DrawerMenu from "../unused/DrawerMenu";


export const Header = observer(() => {
  const isMobile = IsMobile();

  const { router, gameId, isAdmin } = useRouterContext();

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
        {/* {!isMobile && (
          <>
            <Burners />
            <Predeployed />
            <ChainSelector canChange={!gameId} />
          </>
        )} */}

        {/* {!gameId && account && (
          <Card h="48px" p={2} display="flex" justifyContent="center">
            <TokenBalance address={account?.address} token={config?.ryoAddress.paper} icon={PaperIcon} />
          </Card>
        )} */}

        {!gameId && <ClaimReward />}
        {/* {!gameId && <OnGoingGames />} */}
      </HStack>

      {(game /*|| router.asPath.includes("logs")*/) && (
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
              </HStack>
            </Flex>
          </HStack>
        </HStack>
      )}

      <HStack flex="1" justify="right">
        {/* {!isMobile && (
          <>
            <MediaPlayer />
          </>
        )} */}
        {!isMobile && <ConnectButton />}
        {!isMobile && account && game && <ProfileLink />}

        {/* {isMobile && <MobileMenu />} */}

        <DrawerMenu />
      </HStack>
    </HStack>
  );
});
