import Header from "@/components/Header";
import { Skull, Heart, DollarBag, Trophy, Pistol, Arrest, Roll, Siren } from "@/components/icons";
import Input from "@/components/Input";
import Leaderboard from "@/components/Leaderboard";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useSystems } from "@/dojo/hooks/useSystems";
import {
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
  Divider,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UnorderedList,
  ListItem,
  Link,
  Box,
} from "@chakra-ui/react";

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Calendar } from "@/components/icons/archive";
import { formatCash } from "@/utils/ui";
import { Footer } from "@/components/Footer";
import { genAvatarFromId } from "@/components/avatar/avatars";
import { Avatar } from "@/components/avatar/Avatar";
import ShareButton from "@/components/ShareButton";
import { playSound, Sounds } from "@/hooks/sound";
import { usePlayerStore } from "@/hooks/player";

export default function End() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState(0);
  const [isDead, setIsDead] = useState(false);
  const [day, setDay] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState<boolean>(false);

  const { account } = useDojoContext();
  const { playerEntity }= usePlayerStore()

  useEffect(() => {
    if (isDead) {
      playSound(Sounds.Death, 0.3);
    }
  }, [isDead]);

  useEffect(() => {
    if (playerEntity) {
      setName(playerEntity.name);
      setAvatarId(playerEntity.avatarId);
      setIsDead(playerEntity?.health === 0);
      setDay(playerEntity.turn);
    }
  }, [playerEntity]);

  // const onSubmitName = useCallback(async () => {
  //   if (!name) return;

  //   setIsSubmitting(true);
  //   await submitSetName(gameId, name);
  //   router.push("/");
  // }, [name, gameId, router, submitSetName]);

  const onCreditClose = useCallback(() => {
    setIsCreditOpen(false);
  }, [setIsCreditOpen]);

  return (
    <>
      <Flex
        direction="column"
        position="fixed"
        boxSize="full"
        align="center"
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Header back={false} />
        <Container overflowY="auto">
          <VStack flex={["0", "1"]} my="auto">
            {isDead && (
              <Text fontSize="11px" fontFamily="broken-console" padding="0.5rem 0.5rem 0.25rem">
                You died ...
              </Text>
            )}

            <Heading fontSize={["36px", "48px"]} fontWeight="normal">
              Game Over
            </Heading>
            <HStack w="full">
              <VStack flex="1">
                <Image src="/images/trophy1.gif" alt="winner" />
              </VStack>
              <VStack flex="1">
                {/* <StatsItem text="Xth place" icon={<Trophy />} />
                <Divider borderColor="neon.600" /> */}

                <StatsItem text={name} icon={<Avatar name={genAvatarFromId(avatarId)} w="24px" h="24px" />} />
                <Divider borderColor="neon.600" />
                <StatsItem text={`Day ${day}`} icon={<Calendar />} />
                <Divider borderColor="neon.600" />
                <StatsItem text={`${formatCash(playerEntity?.cash || 0)}`} icon={<DollarBag />} />

                {/* <StatsItem
                  text={`${playerEntity?.health} Health`}
                  icon={isDead ? <Skull color="green" /> : <Heart />}
                />
                <Divider borderColor="neon.600" />
                <StatsItem text={`${playerEntity?.wanted}% Wanted`} icon={<Siren color="red" />} />
                <Divider borderColor="neon.600" /> */}
                {/* 
                <Divider borderColor="neon.600" />
                <StatsItem text="X Muggings" icon={<Pistol />} />
                <Divider borderColor="neon.600" />
                <StatsItem text="X Arrest" icon={<Arrest />} /> */}
              </VStack>
            </HStack>

            <HStack gap="10px" w={["full", "auto"]}>
              <Button variant="pixelated" w="full" onClick={() => setIsCreditOpen(true)}>
                <Roll />
              </Button>

              <ShareButton variant="pixelated" />

              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSdHXV6YWUUd2l3azgst0L6vYvLwY6abGoQu5rbf8r7h8ffCnQ/viewform"
                isExternal
                flex="1"
                textDecoration="none"
                _hover={{
                  textDecoration: "none",
                }}
                display="flex"
              >
                <Button variant="pixelated" w="100%">
                  GIVE FEEDBACK
                </Button>
              </Link>
            </HStack>
          </VStack>
          <VStack flex="1" my="auto" justify="space-between">
            <Image display={["none", "flex"]} src="/images/sunset.png" alt="sunset" />
            <Button
              mt="20px"
              onClick={() => {
                router.push("/");
              }}
            >
              Lobby
            </Button>
          </VStack>
        </Container>
        <Spacer maxH="100px" />

        <Modal isOpen={isCreditOpen} onClose={onCreditClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center" mt={1}>
              CREDITS
            </ModalHeader>
            <ModalBody mx->
              <UnorderedList pb={5}>
                <ListItem>
                  Built by{" "}
                  <Link href="https://cartridge.gg/" target="_blank">
                    cartridge
                  </Link>{" "}
                  with{" "}
                  <Link href="https://dojoengine.org/" target="_blank">
                    DOJO
                  </Link>
                </ListItem>

                <ListItem>
                  Art by{" "}
                  <Link href="https://twitter.com/Mr_faxu" target="_blank">
                    Mr. Fax
                  </Link>{" "}
                  &{" "}
                  <Link href="https://twitter.com/HPMNK_One" target="_blank">
                    HPMNK
                  </Link>
                </ListItem>

                <ListItem>
                  Music and SFX by{" "}
                  <Link href="https://twitter.com/CaseyWescott" target="_blank">
                    Casey Wescott
                  </Link>{" "}
                  &{" "}
                  <Link href="https://twitter.com/SheckyGreen" target="_blank">
                    SheckyGreen
                  </Link>
                </ListItem>
              </UnorderedList>
            </ModalBody>
            <ModalFooter justifyContent="stretch">
              <Button w="full" onClick={onCreditClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}

const StatsItem = ({ text, icon }: { text: string; icon: ReactNode }) => {
  return (
    <HStack w="full" h="30px">
      {icon} <Text>{text}</Text>
    </HStack>
  );
};
