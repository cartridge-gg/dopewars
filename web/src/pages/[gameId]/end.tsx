import { PaperCashIcon, Roll, Trophy, Warning } from "@/components/icons";
import { Layout } from "@/components/layout";
import {
  Card,
  Divider,
  HStack,
  Image,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { Button } from "@/components/common";
import { HustlerIcon, Hustlers } from "@/components/hustlers";
import ShareButton from "@/components/pages/profile/ShareButton";
import {
  useDojoContext,
  useGameStore,
  useRegisteredGamesBySeason,
  useRouterContext,
  useSeasonByVersion,
  useSystems,
} from "@/dojo/hooks";
import { formatCash } from "@/utils/ui";
import { observer } from "mobx-react-lite";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { num, shortString } from "starknet";
import { Dopewars_Game as Game } from "@/generated/graphql";
import { useToast } from "@/hooks/toast";
import { ChildrenOrConnect } from "@/components/wallet";

const End = () => {
  const gameStore = useGameStore();
  const { game, gameInfos } = gameStore;
  const { router, gameId } = useRouterContext();
  const {
    clients: { rpcProvider },
  } = useDojoContext();

  const [isCreditOpen, setIsCreditOpen] = useState<boolean>(false);
  const [position, setPosition] = useState(0);
  const [prev, setPrev] = useState<Game | undefined>(undefined);

  const { toast } = useToast();
  const { isPending, registerScore } = useSystems();

  const {
    registeredGames,
    isFetched,
    refetch: refetchRegisteredGame,
  } = useRegisteredGamesBySeason(game?.gameInfos.season_version);

  const { season, sortedList, refetch: refetchSeason } = useSeasonByVersion(game?.gameInfos.season_version);

  useEffect(() => {
    refetchSeason();
    refetchRegisteredGame();
  }, [refetchSeason, refetchRegisteredGame]);

  useEffect(() => {
    if (game) {
      if (game.player?.health === 0) {
        // playSound(Sounds.Death, 0.3);
      }
    }
  }, [game]);

  const onCreditClose = useCallback(() => {
    setIsCreditOpen(false);
  }, [setIsCreditOpen]);

  useEffect(() => {
    if (!game) return;
    const filtered = registeredGames.filter((i) => i.final_score >= game?.player.cash);
    const sorted = filtered.sort((a, b) => b.final_score - a.final_score);

    const prev = sorted.length > 0 ? sorted[sorted.length - 1] : undefined;

    setPrev(prev);

    if (gameInfos?.registered) {
      setPosition(sorted.length);
    } else {
      setPosition(sorted.length + 1);
    }
  }, [registeredGames, game]);

  const onRegister = async () => {
    try {
      const prevGameId = prev ? prev.game_id : 0;
      const prevPlayerId = prev ? prev.player_id : 0;

      const { hash } = await registerScore(gameInfos?.game_id!, prevGameId, prevPlayerId);

      if (hash !== "") {
        toast({
          message: `Registered!`,
          duration: 5_000,
          isError: false,
        });
        await rpcProvider.waitForTransaction(hash, {
          retryInterval: 200,
        });
        setTimeout(() => {
          gameStore.init(gameInfos?.game_id!);
        }, 1_000);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  if (!game || !gameInfos) return null;

  return (
    <Layout
      leftPanelProps={{
        title: "Game Over",
        prefixTitle: game?.player?.health === 0 ? "You died" : "You survived",
        imageSrc: "/images/sunset.png",
      }}
      footer={
        <>
          {gameInfos?.game_mode == "Ranked" && !gameInfos?.registered ? (
            <VStack w="full" gap={3}>
              <Card p={3}>
                <HStack color="yellow.400">
                  <Warning mr={2} color="yellow.400" />
                  <Text maxW="340px">You must register your score in order to be eligible for season rewards</Text>
                </HStack>
              </Card>

              <ChildrenOrConnect>
                <Button isLoading={isPending} onClick={() => onRegister()}>
                  Register you score
                </Button>
              </ChildrenOrConnect>
            </VStack>
          ) : (
            <Button onClick={() => router.push("/")}>Lobby</Button>
          )}
        </>
      }
    >
      <VStack h="full" justifyContent="center" gap={6}>
        <HStack w="full">
          <VStack flex="1">
            {position === 1 && <Image src="/images/trophy1.gif" alt="trophy1" />}
            {position > 1 && position <= sortedList?.size / 10 && <Image src="/images/suitcase.gif" alt="suitcase" />}
            {position > 1 && position > sortedList?.size / 10 && <Image src="/images/trashcan.gif" alt="trashcan" />}
          </VStack>
          <VStack flex="1">
            <StatsItem
              text={shortString.decodeShortString(num.toHexString(BigInt(game?.gameInfos.player_name?.value)))}
              icon={<HustlerIcon hustler={game?.gameInfos.hustler_id as Hustlers} w="24px" h="24px" />}
            />
            {game?.gameInfos.game_mode == "Ranked" && (
              <>
                <Divider borderColor="neon.600" />
                <StatsItem text={`Rank ${position}`} icon={<Trophy />} />
              </>
            )}

            <Divider borderColor="neon.600" />
            {/* <StatsItem text={`Day ${game.player.turn}`} icon={<Calendar />} /> */}
            <StatsItem text={`${formatCash(game?.player?.cash || 0)}`} icon={<PaperCashIcon />} />
            {/* <Divider borderColor="neon.600" /> */}
            {/* <ReputationIndicator reputation={game.player.reputation} /> */}

            {/* <Divider borderColor="neon.600" />
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
            href="https://docs.google.com/forms/d/e/1FAIpQLScWuaWHjXsMJc2kmFvt1TlAdq4szDXh2pm16kBl0H7y2Mo4Xg/viewform"
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
    </Layout>
  );
};

export default observer(End);

const StatsItem = ({ text, icon }: { text: string; icon: ReactNode }) => {
  return (
    <HStack w="full" h="30px">
      {icon} <Text>{text}</Text>
    </HStack>
  );
};
