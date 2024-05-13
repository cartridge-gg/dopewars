import { Button } from "@/components/common";
import { Alert, Clock, LaundromatIcon, PaperCashIcon, PaperIcon, User, Warning } from "@/components/icons";
import { Layout } from "@/components/layout";
import { HomeLeftPanel, Leaderboard, Tutorial } from "@/components/pages/home";
import { HallOfFame } from "@/components/pages/home/HallOfFame";
import { useConfigStore, useDojoContext, useRouterContext, useSeasonByVersion, useSystems } from "@/dojo/hooks";
import { sleep } from "@/dojo/utils";
import { play } from "@/hooks/media";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { Card, Divider, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";

export default function Home() {
  const { router } = useRouterContext();
  const { account } = useAccount();
  const { uiStore, burnerManager } = useDojoContext();
  const { launder, isPending } = useSystems();

  const configStore = useConfigStore();
  const { config } = configStore;
  const {
    season,
    isSeasonOpen,
    isSeasonWashed,
    canCreateGame,
    refetch: refetchSeason,
  } = useSeasonByVersion(config?.ryo.season_version);

  const { toast } = useToast();

  const disableAutoPlay = process.env.NEXT_PUBLIC_DISABLE_MEDIAPLAYER_AUTOPLAY === "true";
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const onHustle = async () => {
    if (!account) {
      uiStore.openConnectModal();
      return;
    }

    if (!disableAutoPlay) {
      play();
    }

    router.push(`/game/new`);
  };

  const onLaunder = async () => {
    if (!account) {
      uiStore.openConnectModal();
      return;
    }

    await launder(season?.version);
    await sleep(500);
    await configStore.init();
  };

  return (
    <Layout
      CustomLeftPanel={HomeLeftPanel}
      rigthPanelScrollable={false}
      // rigthPanelMaxH="calc(100vh - 230px)"
    >
      <VStack boxSize="full" gap="10px">
        <Card variant="pixelated">
          <HStack w="full" p={["10px", "20px"]} gap="10px" justify="center">
            {isSeasonOpen && canCreateGame && (
              <Button flex="1" onClick={onHustle}>
                Hustle
              </Button>
            )}

            {isSeasonOpen && !canCreateGame && (
              <HStack w="full" color="yellow.400" justifyContent="center" gap={3}>
                <Warning color="yellow.400" />

                <VStack h="full">
                  <Text>Waiting for season end ...</Text>
                </VStack>
              </HStack>
            )}

            {!isSeasonOpen && !isSeasonWashed && (
              <HStack w="full">
                <LaundromatIcon isWashing={isPending} />

                <VStack h="full">
                  <Text>
                    Last seasons results need to be washed. Confirm a transaction and earn <PaperIcon />{" "}
                    {config?.ryo.paper_reward_launderer} PAPER!
                  </Text>
                  <Button w="full" isLoading={isPending} onClick={onLaunder}>
                    Launder results
                  </Button>
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

          <TabPanels mt={0} maxH={["100%", "calc(100vh - 380px)"]} overflowY="scroll">
            <TabPanel p={0}>
              <Leaderboard />
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
