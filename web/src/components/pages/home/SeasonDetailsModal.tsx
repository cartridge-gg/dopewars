import { Clock, DollarBag, PaperIcon, Pistol, Trophy } from "@/components/icons";
import { useDojoContext, useGameStore, useSeasonByVersion } from "@/dojo/hooks";
import { SeasonSettingsTable } from "@/pages/season/[seasonId]";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

export const SeasonDetailsModal = observer(() => {
  const { uiStore, configStore } = useDojoContext();
  const { config } = configStore;
  const { gameConfig } = useGameStore();

  const seasonVersion = useMemo(() => {
    return gameConfig?.season_version || config?.ryo.season_version;
  }, [gameConfig, config]);

  const { season, seasonSettings } = useSeasonByVersion(seasonVersion);

  const onClose = () => {
    uiStore.closeSeasonDetails();
  };

  if (!season) return null;

  return (
    <>
      <Modal
        motionPreset="slideInBottom"
        isCentered
        isOpen={uiStore.modals.seasonDetails !== undefined}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg="bg.dark">
          <ModalHeader textAlign="center" pb={0}>
            Season {seasonVersion} Information
          </ModalHeader>
          <ModalBody py={6} minH={"420px"}>
            <Tabs variant="unstyled" w="full">
              <TabList pb={6}>
                <Tab>SETTINGS</Tab>
                <Tab>DETAILS</Tab>
              </TabList>

              <TabPanels mt={0} maxH={"80vh"} overflowY="scroll">
                <TabPanel p={0}>
                  <SeasonSettingsTable settings={seasonSettings} />
                </TabPanel>
                <TabPanel p={0}>
                  <VStack w="full" gap={6} color="neon.500">
                    <VStack w="full" gap={2}>
                      <HStack w="full" alignItems="flex-start">
                        <Clock />
                        <Text>When the countdown reaches zero the season ends</Text>
                      </HStack>
                      <HStack w="full" alignItems="flex-start">
                        <Pistol />
                        <Text>When a player sets a new high score, the season countdown timer resets</Text>
                      </HStack>
                      <HStack w="full" alignItems="flex-start">
                        <DollarBag />
                        <Text>
                          When the timer expires rewards are calculated and distributed to the top 10% of players
                        </Text>
                      </HStack>
                      <HStack w="full" alignItems="flex-start">
                        <Trophy />
                        <Text>The player with the highest score is added to the Hall of Fame</Text>
                      </HStack>
                    </VStack>

                    <VStack w="full" gap={2} color="neon.500">
                      <HStack w="full" alignItems="flex-start">
                        <Text w="120px">Entry fee:</Text>
                        <Text color="neon.400">
                          {season.paper_fee} <PaperIcon />
                        </Text>
                      </HStack>
                      <HStack w="full" alignItems="flex-start">
                        <Text w="120px">Player cut:</Text>
                        <Text color="neon.400">{100 - season.treasury_fee_pct}%</Text>
                      </HStack>
                      <HStack w="full" alignItems="flex-start">
                        <Text w="120px">DAO cut:</Text>
                        <Text color="neon.400">{season.treasury_fee_pct}%</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button w="full" onClick={onClose}>
              CLOSE
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
