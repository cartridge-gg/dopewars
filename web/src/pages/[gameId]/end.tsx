import Header from "@/components/Header";
import { Gem, Trophy, Pistol, Arrest, Roll } from "@/components/icons";
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
} from "@chakra-ui/react";

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { usePlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { useGameEntity } from "@/dojo/queries/useGameEntity";
import { Calendar } from "@/components/icons/archive";
import { Skull, Heart } from "@/components/icons";
import { formatCash } from "@/utils/ui";
import { Footer } from "@/components/Footer";

export default function End() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { setName: submitSetName } = useSystems();
  const [name, setName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState<boolean>(false);

  const { account } = useDojoContext();

  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
      });

  const { game: gameEntity } = useGameEntity({
    gameId,
  });

  const isDead = playerEntity?.health === 0;

  const turnRemaining = isDead
    ? playerEntity?.turnsRemainingOnDeath
    : playerEntity?.turnsRemaining;
  const day = (gameEntity?.maxTurns || 1_000) - (turnRemaining || 0);

  useEffect(() => {
   if( playerEntity&&playerEntity.name ) {
    setName(playerEntity.name)
   }
  }, [playerEntity]);

  const onSubmitName = useCallback(async () => {
    if (!name) return;

    setIsSubmitting(true);
    await submitSetName(gameId, name);
    router.push("/");
  }, [name, gameId, router, submitSetName]);

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
              <Text
                fontSize="11px"
                fontFamily="broken-console"
                padding="0.5rem 0.5rem 0.25rem"
              >
                You died ...
              </Text>
            )}

            <Heading fontSize={["40px", "48px"]} fontWeight="normal">
              Game Over
            </Heading>
            <HStack w="full">
              <VStack flex="1">
                <Image src="/images/trophy.gif" alt="winner" />
              </VStack>
              <VStack flex="1">
                {/* <StatsItem text="Xth place" icon={<Trophy />} />
                <Divider borderColor="neon.600" /> */}
                <StatsItem text={`Day ${day}`} icon={<Calendar />} />
                <Divider borderColor="neon.600" />
                <StatsItem
                  text={`${formatCash(playerEntity?.cash || 0)}`}
                  icon={<Gem />}
                />
                <Divider borderColor="neon.600" />
                <StatsItem
                  text={`${playerEntity?.health} Health`}
                  icon={isDead ? <Skull /> : <Heart />}
                />
                {/* 
                <Divider borderColor="neon.600" />
                <StatsItem text="X Muggings" icon={<Pistol />} />
                <Divider borderColor="neon.600" />
                <StatsItem text="X Arrest" icon={<Arrest />} /> */}
              </VStack>
            </HStack>

            <HStack gap="10px" w={["full", "auto"]}>
              <Button
                variant="pixelated"
                flex="1"
                onClick={() => setIsCreditOpen(true)}
              >
                <Roll /> Credits
              </Button>
              {/* <Button
                variant="pixelated"
                flex="1"
                onClick={() => {
                  router.push("/");
                }}
              >
                <Roll /> Home
              </Button> */}

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
            <VStack w={["full", "400px"]}>
              <Text py="20px" textStyle="subheading" fontSize="13px">
                Name Entry
              </Text>
              <Input
                px="10px"
                border="2px"
                borderColor="neon.500"
                bgColor="neon.700"
                maxLength={31}
                placeholder="Enter your name"
                autoFocus={true}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Text
                w="full"
                align="center"
                color="red"
                visibility={name.length === 31 ? "visible" : "hidden"}
              >
                Max 31 characters
              </Text>
            </VStack>
            <Footer position={["relative", "relative"]}>
              <>
                <Button w={["full", "auto"]} onClick={() => router.push(`/`)}>
                  Skip
                </Button>
                <Button
                  w={["full", "auto"]}
                  onClick={onSubmitName}
                  isLoading={isSubmitting}
                >
                  Update Name
                </Button>
              </>
            </Footer>
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
