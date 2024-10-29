import { Button } from "@/components/common";
import { Flipflop, LaundromatIcon, PaperIcon, Warning } from "@/components/icons";
import { Layout } from "@/components/layout";
import { HomeLeftPanel, Leaderboard, Tutorial } from "@/components/pages/home";
import { HallOfFame } from "@/components/pages/home/HallOfFame";
import { useConfigStore, useDojoContext, useRouterContext, useSeasonByVersion, useSystems } from "@/dojo/hooks";
import { sleep } from "@/dojo/utils";
import { play } from "@/hooks/media";
import { Sounds, playSound } from "@/hooks/sound";
import {
  Card,
  Divider,
  HStack,
  Progress,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import colors from "@/theme/colors";
import { GameMode } from "@/dojo/types";
import { Glock } from "@/components/icons/items";
import { gameModeName } from "@/dojo/helpers";

export default function Home() {
  const { router, isLocalhost } = useRouterContext();
  const { account } = useAccount();
  const { uiStore, burnerManager } = useDojoContext();
  const { launder, isPending } = useSystems();
  const { connectors, connect } = useConnect();

  const configStore = useConfigStore();
  const { config } = configStore;
  const {
    season,
    sortedList,
    isSeasonOpen,
    isSeasonWashed,
    canCreateGame,
    refetch: refetchSeason,
  } = useSeasonByVersion(config?.ryo.season_version);

  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!sortedList || sortedList.process_max_size === 0) return;

    const value = (sortedList?.process_size * 100) / sortedList?.process_max_size;
    setProgressPercent(Math.floor(value));
  }, [sortedList]);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const onHustle = async (gameMode: GameMode) => {
    const mode = gameModeName[gameMode];
    if (!account) {
      if (connectors.length > 1) {
        uiStore.openConnectModal();
      } else {
        connect({ connector: connectors[0] });

        if (connectors[0].id !== "controller") {
          router.push(`/game/${mode}`);
        }
      }
    }

    if (account) {
      router.push(`/game/${mode}`);
    }
  };

  const onLaunder = async () => {
    if (!account) {
      uiStore.openConnectModal();
      return;
    }

    await launder(season?.version);
    await sleep(1000);
    await refetchSeason();
    await configStore.init();
  };

  return (
    <Layout
      customLeftPanel={<HomeLeftPanel />}
      rigthPanelScrollable={false}
      // rigthPanelMaxH="calc(100dvh - 230px)"
    >
      <VStack boxSize="full" gap="10px">
        <Card variant="pixelated">
          <HStack w="full" p={["10px", "20px"]} gap="10px" justify="center">
            {isSeasonOpen && canCreateGame && (
              <Button flex="1" onClick={() => onHustle(GameMode.Noob)}>
                <Flipflop /> Play as guest
              </Button>
            )}
            {isSeasonOpen && canCreateGame && (
              <Button flex="1" onClick={() => onHustle(GameMode.Ranked)}>
                <Glock /> Play Ranked
              </Button>
            )}

            {isSeasonOpen && !canCreateGame && (
              <HStack w="full" color="yellow.400" justifyContent="center" gap={3}>
                <Button flex="1" onClick={() => onHustle(GameMode.Noob)}>
                  <Flipflop /> Play as guest
                </Button>

                <Warning color="yellow.400" />
                <VStack flex="1" h="full">
                  <Text>Waiting for season end ...</Text>
                </VStack>
              </HStack>
            )}

            {!isSeasonOpen && !isSeasonWashed && (
              <HStack w="full">
                <LaundromatIcon isWashing={isPending} />

                <VStack h="full">
                  <Text>
                    Last seasons results need to be washed. Confirm a transaction and earn{" "}
                    <PaperIcon color="yellow.400" mr={1} />
                    <span style={{ color: colors.yellow["400"].toString() }}>
                      {config?.ryo.paper_reward_launderer} PAPER
                    </span>
                    !
                  </Text>
                  <Button w="full" isLoading={isPending} onClick={onLaunder}>
                    Launder results
                  </Button>

                  <VStack w="full" position="relative">
                    <Progress
                      w="full"
                      colorScheme="neon"
                      isIndeterminate={progressPercent === 0}
                      value={progressPercent}
                      max={100}
                      h="22px"
                    />
                    <Text position="absolute" w="full" textAlign="center">
                      {progressPercent}%
                    </Text>
                  </VStack>
                </VStack>
              </HStack>
            )}
          </HStack>
        </Card>

        <Tabs variant="unstyled" w="full">
          <TabList pb={6}>
            <Tab>LEADERBOARD</Tab>
            <Tab>HALL OF FAME</Tab>
          </TabList>

          <TabPanels mt={0} maxH={["100%", "calc(100dvh - 380px)"]} overflowY="scroll">
            <TabPanel p={0}>
              <Leaderboard config={config} />
            </TabPanel>
            <TabPanel p={0}>
              <HallOfFame />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      <Tutorial isOpen={isTutorialOpen} close={() => setIsTutorialOpen(false)} />
    </Layout>
  );
}
