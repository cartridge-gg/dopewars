import { DollarBag, Roll } from "@/components/icons";
import { Header } from "@/components/layout";

import {
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import { Button } from "@/components/common";
import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { Calendar } from "@/components/icons/archive";
import ShareButton from "@/components/pages/profile/ShareButton";
import { useGameStore, useRouterContext } from "@/dojo/hooks";
import { Sounds, playSound } from "@/hooks/sound";
import { formatCash } from "@/utils/ui";
import { useAccount } from "@starknet-react/core";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { shortString } from "starknet";

const End = observer(() => {
  const { router, gameId } = useRouterContext();

  const [hustlerId, setHustlerId] = useState(0);
  const [isDead, setIsDead] = useState(false);
  const [day, setDay] = useState(0);
  const [isCreditOpen, setIsCreditOpen] = useState<boolean>(false);

  const { account } = useAccount();

  const { game, gameInfos } = useGameStore();

  useEffect(() => {
    if (isDead) {
      playSound(Sounds.Death, 0.3);
    }
  }, [isDead]);

  useEffect(() => {
    if (game) {
      setHustlerId(gameInfos?.hustler_id);
      setIsDead(game.player?.health === 0);
      setDay(game.player.turn);
    }
  }, [game, gameInfos?.hustler_id]);

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

                <StatsItem
                  text={shortString.decodeShortString(gameInfos?.player_name)}
                  icon={<HustlerIcon hustler={hustlerId as Hustlers} w="24px" h="24px" />}
                />
                <Divider borderColor="neon.600" />
                <StatsItem text={`Day ${day}`} icon={<Calendar />} />
                <Divider borderColor="neon.600" />
                <StatsItem text={`${formatCash(game?.player?.cash || 0)}`} icon={<DollarBag />} />

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
});

export default End;

const StatsItem = ({ text, icon }: { text: string; icon: ReactNode }) => {
  return (
    <HStack w="full" h="30px">
      {icon} <Text>{text}</Text>
    </HStack>
  );
};
