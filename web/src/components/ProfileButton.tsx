import Button from "@/components/Button";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
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
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ShareButton from "./ShareButton";
import { Avatar } from "./avatar/Avatar";
import { genAvatarFromId } from "./avatar/avatars";
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

export const Profile = ({ close, ...props }: { close?: () => void }) => {
  const { router, gameId, playerId } = useRouterContext();

  const { account } = useDojoContext();
  const configStore = useConfigStore();
  const gameStore = useGameStore();
  const { game, gameInfos } = gameStore;

  // const [attackItem, setAttackItem] = useState<ShopItem | undefined>(game?.items.attack)
  // const [defenseItem, setDefenseItem] = useState<ShopItem | undefined>(game?.items.defense);
  // const [speedItem, setSpeedItem] = useState<ShopItem | undefined>(game?.items.speed);
  // const [transportItem, setTransportItem] = useState<ShopItem | undefined>(game?.items.transport);

  const { toast } = useToast();
  const isMobile = IsMobile();

  useEffect(() => {
    if (gameId && playerId) {
      // spectator
      gameStore.init(gameId, playerId);
    }
  }, [gameId, playerId, gameStore]);

  // useEffect(() => {
  //   if (!playerEntity) return;
  //   setAttackItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Attack));
  //   setDefenseItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Defense));
  //   setSpeedItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Speed));
  //   setTransportItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Transport));
  // }, [playerEntity]);

  if (!game || !configStore) return null;

  return (
    <VStack w="full" {...props}>
      <VStack w="full" maxW="380px" my="auto" pb={[0, "30px"]}>
        <Box w="full" justifyContent="center">
          <VStack w="full">
            <HStack w="full" fontSize="14px">
              <Card w="100px" alignItems="center">
                <Avatar name={genAvatarFromId(gameInfos?.avatar_id)} w="100px" h="100px" />
              </Card>
              <Card flex={2}>
                <HStack h="50px" px="10px">
                  <User />
                  <Heading fontFamily="dos-vga" fontWeight="normal" fontSize={"16px"}>
                    <Text>player.name</Text>
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
                  <Cigarette /> <Text>{game.player.location.name}</Text>
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
                  <Text opacity={0.5}>{game.items.attack.statName}:</Text>
                  <Text>{game.items.attack.stat}</Text>
                </HStack>
                <HStack flex="1" justify="center" /*color={defenseItem ? "yellow.400" : "neon.400"}*/>
                  <Text opacity={0.5}>{game.items.defense.statName}:</Text>
                  <Text>{game.items.defense.stat}</Text>
                </HStack>
                <HStack flex="1" justify="center" /*color={speedItem ? "yellow.400" : "neon.400"}*/>
                  <Text opacity={0.5}>{game.items.speed.statName}:</Text>
                  <Text>{game.items.speed.stat}</Text>
                </HStack>
                <HStack flex="1" justify="center" /*color={transportItem ? "yellow.400" : "neon.400"}*/>
                  <Text opacity={0.5}>{game.items.transport.statName}:</Text>
                  <Text>{game.items.transport.stat}</Text>
                </HStack>
              </HStack>
            </Card>

            <HStack w="full">
              <Card flex="1" h="40px" alignItems="center" justify="center">
                {game.items.attack.icon({
                  boxSize: "26",
                  color: "yellow.400",
                })}
              </Card>
              <Card flex="1" h="40px" alignItems="center" justify="center">
                {game.items.defense.icon({
                  boxSize: "26",
                  color: "yellow.400",
                })}
              </Card>
              <Card flex="1" h="40px" alignItems="center" justify="center">
                {game.items.speed.icon({
                  boxSize: "26",
                  color: "yellow.400",
                })}
              </Card>
              <Card flex="1" h="40px" alignItems="center" justify="center">
                {game.items.transport.icon({
                  boxSize: "26",
                  color: "yellow.400",
                })}
              </Card>
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
};

export const ProfileButtonMobile = () => {
  const { account } = useDojoContext();
  const { gameInfos } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!account || !gameInfos) return null;

  return (
    <>
      <MenuItem h="48px" borderRadius={0} onClick={() => setIsOpen(true)}>
        <Avatar name={genAvatarFromId(gameInfos?.avatar_id)} /> <Text ml="10px">player.name</Text>
      </MenuItem>
      <ProfileModal isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
};

export const ProfileButton = () => {
  const { account } = useDojoContext();
  const { gameInfos } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!account || !gameInfos) return null;

  return (
    <>
      <Button as={Box} cursor="pointer" h={["40px", "48px"]} {...headerButtonStyles} onClick={() => setIsOpen(true)}>
        <Avatar name={genAvatarFromId(gameInfos.avatar_id)} />
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
        <Avatar name={genAvatarFromId(gameInfos.avatar_id)} />
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
        <Avatar name={genAvatarFromId(gameInfos.avatar_id)} /> <Text ml="10px">player.name</Text>
      </MenuItem>
    </>
  );
};
