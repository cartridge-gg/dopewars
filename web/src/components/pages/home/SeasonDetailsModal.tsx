import { Clock, DollarBag, PaperIcon, Pistol, Trophy } from "@/components/icons";
import { useDojoContext } from "@/dojo/hooks";
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
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

export const SeasonDetailsModal = observer(() => {
  const { uiStore, configStore } = useDojoContext();
  const { config } = configStore;

  const onClose = () => {
    uiStore.closeSeasonDetails();
  };

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
            Season Details
          </ModalHeader>
          <ModalBody py={6}>
            <VStack w="full" gap={6} color="neon.500">
              <VStack w="full" gap={2} >
                <HStack w="full" alignItems="flex-start">
                  <Clock />
                  <Text>If the countdown reaches zero the season ends.</Text>
                </HStack>
                <HStack w="full" alignItems="flex-start">
                  <Pistol />
                  <Text>When a player set a new highscore, the season countdown timer resets.</Text>
                </HStack>
                <HStack w="full" alignItems="flex-start">
                  <DollarBag />
                  <Text>When the season ends rewards are distributed to the players with the three highest scores</Text>
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
                    {config?.ryo.paper_fee} <PaperIcon width="16px" height="16px" />
                  </Text>
                </HStack>
                <HStack w="full" alignItems="flex-start">
                  <Text w="120px">Player cut:</Text>
                  <Text color="neon.400">{100 - config?.ryo.treasury_fee_pct}%</Text>
                </HStack>
                <HStack w="full" alignItems="flex-start">
                  <Text w="120px">DAO cut:</Text>
                  <Text color="neon.400">{config?.ryo.treasury_fee_pct}%</Text>
                </HStack>
              </VStack>
            </VStack>
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
