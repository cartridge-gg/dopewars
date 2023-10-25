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
import { Calendar } from "./icons/archive";
import { ItemTextEnum } from "@/dojo/types";
import { ShopItem } from "@/dojo/queries/usePlayerEntity";
import { getShopItem, getShopItemStatname } from "@/dojo/helpers";
import { Dots, DollarBag, Heart, Roll, Siren } from "./icons";
import { formatCash } from "@/utils/ui";
import Link from "next/link";

const Profile = ({ isOpen, close }: { isOpen: boolean; close: () => void }) => {
  const { account, playerEntityStore } = useDojoContext();
  const { playerEntity } = playerEntityStore;

  const [attackItem, setAttackItem] = useState<ShopItem | undefined>(undefined);
  const [defenseItem, setDefenseItem] = useState<ShopItem | undefined>(undefined);
  const [speedItem, setSpeedItem] = useState<ShopItem | undefined>(undefined);
  const [transportItem, setTransportItem] = useState<ShopItem | undefined>(undefined);

  useEffect(() => {
    if (!playerEntity) return;
    setAttackItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Attack));
    setDefenseItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Defense));
    setSpeedItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Speed));
    setTransportItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Transport));
  }, [playerEntity]);

  if (!account || !playerEntity) return null;

  return (
    <Modal isOpen={isOpen} onClose={close} isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh" maxWidth={"420px"}>
        <ModalHeader pt="30px">
          <VStack w="full">
            <Heading fontFamily="dos-vga" fontWeight="normal" fontSize="24px">
              {playerEntity.name}
            </Heading>
            <HStack color="neon.500">
              <Calendar /> <Text>DAY {playerEntity.turn }</Text>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalBody justifyContent="center">
          <VStack w="full">
            <HStack w="full" fontSize="14px">
              <Card flex={1}>
                <Avatar name={genAvatarFromId(playerEntity.avatarId)} w="80px" h="80px" />
              </Card>
              <Card flex={3}>
                <HStack w="full" gap="0">
                  <VStack w="full" align="flex-start" gap="0">
                    <HStack h="40px" w="full" borderBottom="solid 2px" borderRight="solid 2px" borderColor="neon.600">
                      <DollarBag ml="8px" /> <Text>{formatCash(playerEntity?.cash)}</Text>
                    </HStack>
                    <HStack h="40px" w="full" borderRight="solid 2px" borderColor="neon.600">
                      <DollarBag ml="8px" /> <Text>{formatCash(420)}</Text>
                    </HStack>
                  </VStack>

                  <VStack w="110px" align="flex-start" gap="0">
                    <HStack h="40px" w="full" borderBottom="solid 2px" borderColor="neon.600">
                      <Heart ml="8px" /> <Text>{playerEntity?.health}</Text>
                    </HStack>
                    <HStack h="40px" w="full">
                      <Siren ml="8px" /> <Text>{playerEntity?.wanted}</Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
            </HStack>

            <Card w="full">
              <HStack w="full" alignItems="center" justify="space-evenly" h="40px" fontSize="12px">
                <HStack flex="1" justify="center" color={attackItem ? "yellow.400" : "neon.400"}>
                  <Text opacity={0.5}>{getShopItemStatname(ItemTextEnum.Attack)}:</Text>
                  <Text>{attackItem?.value || 0}</Text>
                </HStack>
                <HStack flex="1" justify="center" color={defenseItem ? "yellow.400" : "neon.400"}>
                  <Text opacity={0.5}>{getShopItemStatname(ItemTextEnum.Defense)}:</Text>
                  <Text> {defenseItem?.value || 0}</Text>
                </HStack>
                <HStack flex="1" justify="center" color={speedItem ? "yellow.400" : "neon.400"}>
                  <Text opacity={0.5}>{getShopItemStatname(ItemTextEnum.Speed)}:</Text>
                  <Text> {speedItem?.value || 0}</Text>
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
        </ModalBody>
        <ModalFooter justifyContent="center" w="full" pb="30px" pt="30px">
          <HStack w="full">
            <Button w="full" onClick={close}>
              Close
            </Button>
            <ChakraLink w="full" href={`https://twitter.com/intent/tweet?text=${window.location}`} target="_blank">
              <Button w="full">X Share</Button>
            </ChakraLink>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


export const ProfileButtonMobile = () => {
  const { account, playerEntityStore } = useDojoContext();
  const { playerEntity } = playerEntityStore;
  const [isOpen, setIsOpen] = useState(false);

  if (!account || !playerEntity) return null;

  return (
    <>
      <MenuItem h="48px" borderRadius={0} onClick={() => setIsOpen(true)}>
        <Avatar name={genAvatarFromId(playerEntity.avatarId)} /> <Text ml="10px">{playerEntity.name}</Text>
      </MenuItem>
      <Profile isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
};

const ProfileButton = () => {
  const { account, playerEntityStore } = useDojoContext();
  const { playerEntity } = playerEntityStore;
  const [isOpen, setIsOpen] = useState(false);

  if (!account || !playerEntity) return null;

  return (
    <>
      <Button h={["40px", "48px"]} {...headerButtonStyles} onClick={() => setIsOpen(true)}>
        <Avatar name={genAvatarFromId(playerEntity.avatarId)} />
      </Button>
      <Profile isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
};

export default ProfileButton;


