import Button from "@/components/Button";
import { statName } from "@/dojo/helpers";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { ItemSlot } from "@/dojo/types";
import { useToast } from "@/hooks/toast";
import { headerButtonStyles } from "@/theme/styles";
import { IsMobile } from "@/utils/ui";
import {
  Box,
  Card,
  Divider,
  HStack,
  Heading,
  MenuItem,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ShareButton from "./ShareButton";
import { HustlerIcon, Hustlers } from "./hustlers";
import { Cigarette, User } from "./icons";

const ProfileModal = ({ isOpen, close }: { isOpen: boolean; close: () => void }) => {
  return (
    <Modal isOpen={isOpen} onClose={close} isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh" maxWidth={"420px"}>
        <VStack w="full" px="16px">
          <Profile close={close} />
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export const Profile = observer(({ close, ...props }: { close?: () => void }) => {
  const { router, gameId, playerId } = useRouterContext();

  const { account } = useDojoContext();
  const configStore = useConfigStore();
  const gameStore = useGameStore();
  const { game, gameInfos, gameEvents } = gameStore;

  const { toast } = useToast();
  const isMobile = IsMobile();

  useEffect(() => {
    if (gameId && playerId) {
      // spectator
      gameStore.init(gameId, playerId);
    }
  }, [gameId, playerId, gameStore]);

  if (!game || !gameEvents || !gameInfos || !configStore) return null;

  return (
    <VStack w="full" {...props}>
      <VStack w="full" maxW="380px" my="auto" pb={[0, "30px"]}>
        <Box w="full" justifyContent="center">
          <VStack w="full">
            <HStack w="full" fontSize="14px">
              <Card w="100px" alignItems="center" p={1}>
                <HustlerIcon hustler={gameInfos!.hustler_id as Hustlers} w="100px" h="100px" />
              </Card>
              <Card flex={2}>
                <HStack h="50px" px="10px">
                  <User />
                  <Heading fontFamily="dos-vga" fontWeight="normal" fontSize={"16px"}>
                    <Text>{gameEvents.playerName}</Text>
                  </Heading>
                </HStack>

                <Divider
                  orientation="horizontal"
                  w="full"
                  borderTopWidth="1px"
                  borderBottomWidth="1px"
                  borderColor="neon.600"
                />
                <HStack h="50px" px="10px">
                  {/* <Calendar /> <Text>DAY {playerEntity.turn}</Text> */}
                  <Cigarette /> <Text>{game.player.location?.name}</Text>
                </HStack>

                {/* <HStack w="full" gap="0">
                  <VStack w="full" align="flex-start" gap="0">
                    <CashIndicator cash={playerEntity?.cash} h="40px" w="full" ml="8px" />
                     <Divider
                      orientation="horizontal"
                      borderTopWidth="1px"
                      borderBottomWidth="1px"
                      borderColor="neon.600"
                    />
                  </VStack>
                  
                  <Divider orientation="vertical" h="80px" borderWidth="1px" borderColor="neon.600" />

                  <VStack w="110px" align="flex-start" gap="0">
                    <HealthIndicator health={playerEntity?.health} h="40px" w="full" ml="8px" />
                    <Divider
                      orientation="horizontal"
                      w="full"
                      borderTopWidth="1px"
                      borderBottomWidth="1px"
                      borderColor="neon.600"
                    />
                    <WantedIndicator wanted={playerEntity?.wanted} h="40px" w="full" ml="8px" />
                  </VStack>
                </HStack> */}
              </Card>
            </HStack>

            <Card w="full">
              <HStack w="full" alignItems="center" justify="space-evenly" h="40px" fontSize="12px">
                <HStack flex="1" justify="center" /*color={attackItem ? "yellow.400" : "neon.400"}*/>
                  <Text opacity={0.5}>{statName[ItemSlot.Weapon]}:</Text>
                  <Text>{game.items.attack!.tier.stat}</Text>
                </HStack>

                <HStack flex="1" justify="center" /*color={defenseItem ? "yellow.400" : "neon.400"}*/>
                  <Text opacity={0.5}>{statName[ItemSlot.Clothes]}:</Text>
                  <Text>{game.items.defense!.tier.stat}</Text>
                </HStack>

                <HStack flex="1" justify="center" /*color={speedItem ? "yellow.400" : "neon.400"}*/>
                  <Text opacity={0.5}>{statName[ItemSlot.Feet]}:</Text>
                  <Text>{game.items.speed!.tier.stat}</Text>
                </HStack>

                <HStack flex="1" justify="center" /*color={transportItem ? "yellow.400" : "neon.400"}*/>
                  <Text opacity={0.5}>{statName[ItemSlot.Transport]}:</Text>
                  <Text>{game.items.transport!.tier.stat / 100}</Text>
                </HStack>
              </HStack>
            </Card>

            <HStack w="full">
              <Tooltip label={`${game.items.attack!.upgradeName} - $${game.items.attack!.tier.cost}`}>
                <Card flex="1" h="40px" alignItems="center" justify="center">
                  {game.items.attack!.icon({
                    boxSize: "26",
                    color: "yellow.400",
                  })}
                </Card>
              </Tooltip>
              <Tooltip label={`${game.items.defense!.upgradeName} - $${game.items.defense!.tier.cost}`}>
                <Card flex="1" h="40px" alignItems="center" justify="center">
                  {game.items.defense!.icon({
                    boxSize: "26",
                    color: "yellow.400",
                  })}
                </Card>
              </Tooltip>
              <Tooltip label={`${game.items.speed!.upgradeName} - $${game.items.speed!.tier.cost}`}>
                <Card flex="1" h="40px" alignItems="center" justify="center">
                  {game.items.speed!.icon({
                    boxSize: "26",
                    color: "yellow.400",
                  })}
                </Card>
              </Tooltip>
              <Tooltip label={`${game.items.transport!.upgradeName} - $${game.items.transport!.tier.cost}`}>
                <Card flex="1" h="40px" alignItems="center" justify="center">
                  {game.items.transport!.icon({
                    boxSize: "26",
                    color: "yellow.400",
                  })}
                </Card>
              </Tooltip>
            </HStack>
          </VStack>
        </Box>
        <Box w="full" justifyContent="center" py={["10px", "30px"]}>
          <HStack w="full">
            {close && (
              <Button w="full" onClick={close}>
                Close
              </Button>
            )}
            {!playerId && account && (
              <>
                <Button
                  variant="pixelated"
                  w="full"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/${gameId}/logs?playerId=${account.address}`,
                    );

                    toast({
                      message: "Copied to clipboard",
                    });
                  }}
                >
                  Game Link
                </Button>
                <ShareButton variant="pixelated" />
              </>
            )}
          </HStack>
        </Box>
      </VStack>
    </VStack>
  );
});

const ProfileButtonMobile = () => {
  const { account } = useDojoContext();
  const { gameInfos } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!account || !gameInfos) return null;

  return (
    <>
      <MenuItem h="48px" borderRadius={0} onClick={() => setIsOpen(true)}>
        {/* <Avatar name={genAvatarFromId(gameInfos?.hustler_id)} /> <Text ml="10px">player.name</Text> */}
        <HustlerIcon hustler={gameInfos.hustler_id as Hustlers} />
        <Text ml="10px">player.name</Text>
      </MenuItem>
      <ProfileModal isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
};

const ProfileButton = () => {
  const { account } = useDojoContext();
  const { gameInfos } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!account || !gameInfos) return null;

  return (
    <>
      <Button as={Box} cursor="pointer" h={["40px", "48px"]} {...headerButtonStyles} onClick={() => setIsOpen(true)}>
        {/* <Avatar name={genAvatarFromId(gameInfos.hustler_id)} /> */}
        <HustlerIcon hustler={gameInfos.hustler_id as Hustlers} />
      </Button>
      <ProfileModal isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
};

export const ProfileLink = () => {
  const { router, gameId } = useRouterContext();

  const { account } = useDojoContext();
  const { gameInfos } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!account || !gameInfos) return null;

  return (
    <>
      <Button as={Box} cursor="pointer" h={["40px", "48px"]} {...headerButtonStyles} onClick={onClick}>
        <HustlerIcon hustler={gameInfos.hustler_id as Hustlers} />
      </Button>
    </>
  );
};

export const ProfileLinkMobile = () => {
  const { router, gameId } = useRouterContext();

  const { account } = useDojoContext();
  const { gameInfos } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!account || !gameInfos) return null;

  return (
    <>
      <MenuItem h="48px" borderRadius={0} onClick={onClick}>
        <HustlerIcon hustler={gameInfos.hustler_id as Hustlers} />
        <Text ml="10px">player.name</Text>
      </MenuItem>
    </>
  );
};
