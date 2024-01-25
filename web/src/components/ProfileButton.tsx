import {
  Text,
  VStack,
  HStack,
  Divider,
  Card,
  Heading,
  Image,
  Box,
  Link as ChakraLink,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  MenuItem,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { playSound, Sounds } from "@/hooks/sound";
import Dot from "./Dot";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { Avatar } from "./avatar/Avatar";
import { genAvatarFromAddress, genAvatarFromId } from "./avatar/avatars";
import { headerStyles, headerButtonStyles } from "@/theme/styles";
import { Calendar, Cigarette } from "./icons/archive";
import { ItemTextEnum } from "@/dojo/types";
import { PlayerEntity, ShopItem } from "@/dojo/queries/usePlayerEntity";
import { getLocationById, getShopItem, getShopItemStatname } from "@/dojo/helpers";
import { Dots, Gem, Twitter, User } from "./icons";
import { IsMobile, formatCash } from "@/utils/ui";
import Link from "next/link";
import HealthIndicator from "./player/HealthIndicator";
import WantedIndicator from "./player/WantedIndicator";
import CashIndicator from "./player/CashIndicator";
import ShareButton from "./ShareButton";
import { useRouter } from "next/router";
import { Glock } from "./icons/items";
import { useToast } from "@/hooks/toast";
import { usePlayerStore } from "@/hooks/player";

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
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const playerId = router.query.playerId as string;

  const { account } = useDojoContext();
  const { playerEntity }= usePlayerStore()

  const [attackItem, setAttackItem] = useState<ShopItem | undefined>(undefined);
  const [defenseItem, setDefenseItem] = useState<ShopItem | undefined>(undefined);
  const [speedItem, setSpeedItem] = useState<ShopItem | undefined>(undefined);
  const [transportItem, setTransportItem] = useState<ShopItem | undefined>(undefined);

  const { toast } = useToast();

  const isMobile = IsMobile();

  useEffect(() => {
    if (playerId) {
      // spectator
      playerStore.initPlayerEntity(gameId, playerId);
    }
  }, [gameId, playerId, playerStore]);

  useEffect(() => {
    if (!playerEntity) return;
    setAttackItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Attack));
    setDefenseItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Defense));
    setSpeedItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Speed));
    setTransportItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Transport));
  }, [playerEntity]);

  if (/*!account &&*/ !playerEntity) return null;

  return (
    <VStack w="full" {...props}>
      <VStack w="full" maxW="380px" my="auto" pb={[0, "30px"]}>
        <Box w="full" justifyContent="center">
          <VStack w="full">
            <HStack w="full" fontSize="14px">
              <Card w="100px" alignItems="center">
                <Avatar name={genAvatarFromId(playerEntity.avatarId)} w="100px" h="100px" />
              </Card>
              <Card flex={2}>
                <HStack h="50px" px="10px">
                  <User />
                  <Heading fontFamily="dos-vga" fontWeight="normal" fontSize={"16px"}>
                    <Text>{playerEntity.name}</Text>
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
                  <Cigarette /> <Text>{getLocationById(playerEntity.locationId)?.name}</Text>
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
                <HStack flex="1" justify="center" color={attackItem ? "yellow.400" : "neon.400"}>
                  <Text opacity={0.5}>{getShopItemStatname(ItemTextEnum.Attack)}:</Text>
                  <Text>{playerEntity.getAttack()}</Text>
                </HStack>
                <HStack flex="1" justify="center" color={defenseItem ? "yellow.400" : "neon.400"}>
                  <Text opacity={0.5}>{getShopItemStatname(ItemTextEnum.Defense)}:</Text>
                  <Text> {playerEntity.getDefense()}</Text>
                </HStack>
                <HStack flex="1" justify="center" color={speedItem ? "yellow.400" : "neon.400"}>
                  <Text opacity={0.5}>{getShopItemStatname(ItemTextEnum.Speed)}:</Text>
                  <Text> {playerEntity.getSpeed()}</Text>
                </HStack>
                <HStack flex="1" justify="center" color={transportItem ? "yellow.400" : "neon.400"}>
                  <Text opacity={0.5}>{getShopItemStatname(ItemTextEnum.Transport)}:</Text>
                  <Text> {playerEntity?.getTransport()}</Text>
                </HStack>
              </HStack>
            </Card>

            <HStack w="full">
              <Card flex="1" h="40px" alignItems="center" justify="center">
                {attackItem ? (
                  getShopItem(attackItem.id, attackItem.level).icon({
                    boxSize: "26",
                    color: "yellow.400",
                  })
                ) : (
                  <Dots color="neon.600" />
                )}
              </Card>
              <Card flex="1" h="40px" alignItems="center" justify="center">
                {defenseItem ? (
                  getShopItem(defenseItem.id, defenseItem.level).icon({
                    boxSize: "26",
                    color: "yellow.400",
                  })
                ) : (
                  <Dots color="neon.600" />
                )}
              </Card>
              <Card flex="1" h="40px" alignItems="center" justify="center">
                {speedItem ? (
                  getShopItem(speedItem.id, speedItem.level).icon({
                    boxSize: "26",
                    color: "yellow.400",
                  })
                ) : (
                  <Dots color="neon.600" />
                )}
              </Card>
              <Card flex="1" h="40px" alignItems="center" justify="center">
                {transportItem ? (
                  getShopItem(transportItem.id, transportItem.level).icon({
                    boxSize: "26",
                    color: "yellow.400",
                  })
                ) : (
                  <Dots color="neon.600" />
                )}
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

const getShareText = (playerEntity: PlayerEntity): string => {
  if (playerEntity.health > 0) {
    return encodeURIComponent(
      `${playerEntity.name} has reached Day ${playerEntity.turn} with ${formatCash(
        playerEntity.cash,
      )} $paper. Think you can out hustle them? #rollyourown.\n\n${window.location.origin}`,
    );
  } else {
    return encodeURIComponent(
      `${playerEntity.name} got dropped on Day ${playerEntity.turn} but pocketed ${formatCash(
        playerEntity.cash,
      )} $paper before checking out. Think you can out hustle them? #rollyourown.\n\n${window.location.origin}`,
    );
  }
};

export const ProfileButtonMobile = () => {
  const { account } = useDojoContext();
  const { playerEntity }= usePlayerStore()
  const [isOpen, setIsOpen] = useState(false);

  if (!account || !playerEntity) return null;

  return (
    <>
      <MenuItem h="48px" borderRadius={0} onClick={() => setIsOpen(true)}>
        <Avatar name={genAvatarFromId(playerEntity.avatarId)} /> <Text ml="10px">{playerEntity.name}</Text>
      </MenuItem>
      <ProfileModal isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
};

export const ProfileButton = () => {
  const { account } = useDojoContext();
  const { playerEntity }= usePlayerStore()
  const [isOpen, setIsOpen] = useState(false);

  if (!account || !playerEntity) return null;

  return (
    <>
      <Button as={Box} cursor="pointer" h={["40px", "48px"]} {...headerButtonStyles} onClick={() => setIsOpen(true)}>
        <Avatar name={genAvatarFromId(playerEntity.avatarId)} />
      </Button>
      <ProfileModal isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
};

export const ProfileLink = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { account } = useDojoContext();
  const { playerEntity }= usePlayerStore()
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!account || !playerEntity) return null;

  return (
    <>
      <Button as={Box} cursor="pointer" h={["40px", "48px"]} {...headerButtonStyles} onClick={onClick}>
        <Avatar name={genAvatarFromId(playerEntity.avatarId)} />
      </Button>
    </>
  );
};

export const ProfileLinkMobile = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { account } = useDojoContext();
  const { playerEntity }= usePlayerStore()
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!account || !playerEntity) return null;

  return (
    <>
      <MenuItem h="48px" borderRadius={0} onClick={onClick}>
        <Avatar name={genAvatarFromId(playerEntity.avatarId)} /> <Text ml="10px">{playerEntity.name}</Text>
      </MenuItem>
    </>
  );
};
