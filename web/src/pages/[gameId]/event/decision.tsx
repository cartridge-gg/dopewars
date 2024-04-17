import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { ShopItem, PlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { getLocationById, getShopItem } from "@/dojo/helpers";
import { useSystems } from "@/dojo/hooks/useSystems";
import { Action, ItemTextEnum, Outcome, PlayerStatus } from "@/dojo/types";
import { ConsequenceEventData, MarketEventData, displayMarketEvents } from "@/dojo/events";
import { Card, Divider, HStack, Heading, Text, VStack, Image, StyleProps, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { Footer } from "@/components/Footer";
import Button from "@/components/Button";
import { useToast } from "@/hooks/toast";
import { playSound, Sounds } from "@/hooks/sound";
import { Inventory } from "@/components/Inventory";
import { IsMobile, formatCash } from "@/utils/ui";
import { getSentence } from "@/responses";
import CashIndicator from "@/components/player/CashIndicator";
import HealthIndicator from "@/components/player/HealthIndicator";
import { Encounter } from "@/generated/graphql";
import { DollarBag, Fist, Flipflop, Heart, Siren } from "@/components/icons";

type CombatLog = {
  text: string;
  color: string;
  icon?: React.FC;
};

function getImageSrc(status: PlayerStatus, encounter: Encounter) {
  const levelSuffix = encounter.level <= 3 ? encounter.level : 3; // Ensures level is capped at 3 for image selection
  switch (status) {
    case PlayerStatus.BeingMugged:
      return `/images/events/muggers${encounter!.level <= 3 ? encounter!.level : 3}.gif`;
    case PlayerStatus.BeingDrugged: // Assuming this is the case for cops
      return `/images/events/duende-drug.gif`;
    case PlayerStatus.BeingArrested:
      return `/images/events/cops${encounter!.level <= 3 ? encounter!.level : 3}.gif`;
    default:
      return `/images/events/default.gif`; // A default case if none of the above
  }
}

export default function Decision() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const healthLoss = router.query.healthLoss as string;
  const demandPct = router.query.demandPct as string;

  const { account, playerEntityStore } = useDojoContext();

  const [status, setStatus] = useState<PlayerStatus>();
  const [prefixTitle, setPrefixTitle] = useState("");
  const [title, setTitle] = useState("");
  const [demand, setDemand] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [encounter, setEncounter] = useState<Encounter | undefined>(undefined);

  const [attackItem, setAttackItem] = useState<ShopItem | undefined>(undefined);
  const [speedItem, setSpeedItem] = useState<ShopItem | undefined>(undefined);

  const [isPaying, setIsPaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFigthing, setIsFigthing] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const [combatLogs, setCombatLogs] = useState<CombatLog[]>([]);
  const [sentence, setSentence] = useState("");

  const toaster = useToast();
  const { decide, isPending } = useSystems();

  const { playerEntity } = playerEntityStore;

  const combatsListRef = useRef(null);
  const isMobile = IsMobile();

  useEffect(() => {
    if (playerEntity && !isPending) {
      switch (PlayerStatus[playerEntity.status]) {
        case PlayerStatus.BeingMugged:
          setPrefixTitle("You encountered a...");
          setTitle("Gang!");
          setDemand(`They want ${demandPct}% of your $PAPER!`);
          setSentence(getSentence(PlayerStatus.BeingMugged, Action.Fight));
          break;
        case PlayerStatus.BeingArrested:
          setPrefixTitle("You encountered the...");
          setTitle("Cops!");
          setDemand(`They want ${demandPct}% of your DRUGS!`);
          setSentence(getSentence(PlayerStatus.BeingArrested, Action.Fight));
          break;
        case PlayerStatus.BeingDrugged:
          setPrefixTitle("You stumbled upon a...");
          setTitle("Mysterious Goblin!");
          setDemand(`The Goblin offers you some magical mushrooms for a trip!`);
          setSentence(getSentence(PlayerStatus.BeingDrugged, Action.Accept));
          break;
      }

      setStatus(playerEntity.status);
    }
  }, [playerEntity, isPending, demandPct]);

  useEffect(() => {
    if (status == PlayerStatus.BeingArrested) {
      playSound(Sounds.Police);
    }
    if (status == PlayerStatus.BeingMugged) {
      playSound(Sounds.Gang);
    }
    if (status == PlayerStatus.BeingDrugged) {
      playSound(Sounds.Goblin);
    }
  }, [status]);

  useEffect(() => {
    if (playerEntity && playerEntity.items) {
      setAttackItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Attack));
      setSpeedItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Speed));
    }
  }, [playerEntity, playerEntity?.items]);

  useEffect(() => {
    if (playerEntity && playerEntity.encounters && !isPending) {
      if (status === PlayerStatus.BeingMugged) {
        setEncounter(playerEntity.encounters.find((i) => i.encounter_id === "Gang"));
      }
      if (status === PlayerStatus.BeingArrested) {
        setEncounter(playerEntity.encounters.find((i) => i.encounter_id === "Cops"));
      }
      if (status === PlayerStatus.BeingDrugged) {
        setEncounter(playerEntity.encounters.find((i) => i.encounter_id === "Goblin"));
      }
    }
  }, [playerEntity, playerEntity?.encounters, status, isPending]);

  useEffect(() => {
    if (!isPending) {
      setIsPaying(false);
      setIsRunning(false);
      setIsFigthing(false);
      setIsAccepting(false);
      setIsDeclining(false);
    }
  }, [isPending]);

  useEffect(() => {
    if (!combatsListRef.current) return;
    const lastEl = combatsListRef.current["lastElementChild"];
    // @ts-ignore
    lastEl && lastEl.scrollIntoView({ behavior: "smooth" });
  }, [combatLogs.length]);

  const addCombatLog = (log: CombatLog) => {
    setCombatLogs((logs) => [...logs, log]);
  };

  const onDecision = async (action: Action) => {
    try {
      switch (action) {
        case Action.Pay:
          addCombatLog({ text: "You decided to pay up", color: "neon.400", icon: DollarBag });
          setSentence(getSentence(playerEntity!.status, Action.Pay));
          playSound(Sounds.Pay);
          break;
        case Action.Run:
          addCombatLog({
            text: "You split without a second thought",
            color: "neon.400",
            icon: speedItem ? getShopItem(speedItem.id, speedItem.level).icon : Flipflop,
          });
          setSentence(getSentence(playerEntity!.status, Action.Run));
          playSound(Sounds.Run);
          break;
        case Action.Fight:
          //addCombatLog({ text: "Bouyakaaa", color: "neon.400" });
          setSentence(getSentence(playerEntity!.status, Action.Fight));
          switch (attackItem?.level) {
            case 1:
              playSound(Sounds.Knife);
              break;
            case 2:
              playSound(Sounds.Magnum357);
              break;
            case 3:
              playSound(Sounds.Uzi);
              break;
            default:
              playSound(Sounds.Punch);
              break;
          }
          break;
          case Action.Accept:
            addCombatLog({
              text: "You nod in agreement, accepting the offer with a mix of curiosity and caution.",
              color: "neon.400",
              icon: DollarBag,
            });
            setSentence(getSentence(playerEntity!.status, Action.Accept));
            playSound(Sounds.Mushroom); 
            break;
          case Action.Decline:
            addCombatLog({
              text: "You shake your head firmly, declining the offer and preparing for any fallout.",
              color: "neon.400",
              icon: DollarBag,
            });
            setSentence(getSentence(playerEntity!.status, Action.Decline));
            playSound(Sounds.Run); 
            break;
      }

      // setIsPaying(false);
      // setIsRunning(false);
      // setIsFigthing(false);
      // return;

      // save player status
      const playerStatus = playerEntity?.status;

      const { event, events } = await decide(gameId, action);

      if (events) {
        displayMarketEvents(events as MarketEventData[], toaster);
      }

      const consequenceEvent = event as ConsequenceEventData;

      switch (consequenceEvent.outcome) {
        case Outcome.Died:
          setIsRedirecting(true);
          return router.replace(`/${gameId}/end`);

        case Outcome.Paid:
        case Outcome.Escaped:
          setIsRedirecting(true);
          consequenceEvent.dmgDealt > 0 &&
            addCombatLog({
              text: `You dealt ${consequenceEvent.dmgDealt}HP!`,
              color: "neon.400",
              icon: attackItem ? getShopItem(attackItem.id, attackItem.level).icon : undefined,
            });
          return router.replace(
            `/${gameId}/event/consequence?outcome=${consequenceEvent.outcome}&status=${playerStatus}`,
          );

        case Outcome.Victorious:
          setIsRedirecting(true);
          consequenceEvent.dmgDealt > 0 &&
            addCombatLog({ text: `You dealt ${consequenceEvent.dmgDealt}HP!`, color: "neon.400" });
          return router.replace(
            `/${gameId}/event/consequence?outcome=${consequenceEvent.outcome}&status=${playerStatus}&payout=${
              encounter!.payout
            }`,
          );

        case Outcome.Captured:
          playSound(Sounds.Ooo);
          consequenceEvent.dmgDealt > 0 &&
            addCombatLog({
              text: `You dealt ${consequenceEvent.dmgDealt}HP!`,
              color: "neon.400",
              icon: attackItem ? getShopItem(attackItem.id, attackItem.level).icon : Fist,
            });
          addCombatLog({ text: `You lost ${consequenceEvent.healthLoss}HP!`, color: "red", icon: Heart });
          break;

        case Outcome.Drugged:
          playSound(Sounds.Ooo);
          // consequenceEvent.dmgDealt > 0 &&
          //   addCombatLog({
          //     text: `You dealt ${consequenceEvent.dmgDealt}HP!`,
          //     color: "neon.400",
          //     icon: attackItem ? getShopItem(attackItem.id, attackItem.level).icon : Fist,
          //   });
          // addCombatLog({ text: `You lost ${consequenceEvent.healthLoss}HP!`, color: "red", icon: Heart });
          break;
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (!playerEntity || !router.isReady || isRedirecting) {
    return <></>;
  }

  // if playerEntity is too slow to update, PlayerStatus is still Normal
  if ((playerEntity.status == PlayerStatus.Normal || !encounter) && !isPending) {
    //router.push(`/${gameId}/turn`);
    // router.push(
    //   `/${gameId}/${getLocationById(playerEntity.locationId)!.slug}`,
    // );
    return <></>;
  }

  return (
    <Layout isSinglePanel>
      <HStack
        w="full"
        h={["calc(100vh - 70px)", "calc(100vh - 120px)"]}
        overflowY="scroll"
        sx={{
          "scrollbar-width": "none",
        }}
        flexDir={["column", "row"]}
      >
        <Encounter
          prefixTitle={prefixTitle}
          title={title}
          demand={demand}
          sentence={sentence}
          encounter={encounter!}
          playerEntity={playerEntity}
          imageSrc={getImageSrc(playerEntity.status, encounter!)}
          flex={[0, 1]}
          mb={0}
          w="full"
        />

        <VStack w="full" h={["auto", "100%"]} flex={[0, 1]} position="relative">
          <VStack w="full" h={["100%"]}>
            <Inventory />
            <VStack w="full" h="100%">
              <VStack w="full" alignItems="flex-start">
                <Text textStyle="subheading" mt={["10px", "30px"]} fontSize="10px" color="neon.500">
                  Combat Log
                </Text>
                <Card
                  w="full"
                  maxH={isMobile ? "calc( 100vh - 560px)" : "calc( 100vh - 380px)"}
                  overflowY="scroll"
                  sx={{
                    "scrollbar-width": "none",
                  }}
                  alignItems="flex-start"
                  px="16px"
                  py="8px"
                >
                  <Text color="red" mb={combatLogs!.length > 0 ? "10px" : "0"}>
                    <Heart /> You lost {healthLoss} HP!
                  </Text>

                  <VStack w="full" alignItems="flex-start" ref={combatsListRef}>
                    {combatLogs &&
                      combatLogs.map((i, key) => (
                        <HStack key={`log-${key}`} color={i.color} _last={{ marginBottom: 0 }}>
                          {i.icon &&
                            i.icon({
                              boxSize: "26",
                            })}
                          <Text>{i.text}</Text>
                        </HStack>
                      ))}
                  </VStack>
                </Card>
              </VStack>
            </VStack>
          </VStack>

          <Box minH="60px" />

          { !PlayerStatus.BeingDrugged ? (
                      <Footer position={["fixed", "absolute"]} p={["8px !important", "0"]}>
                      <Button
                        w="full"
                        px={["auto","20px"]}
                        isDisabled={isRunning || isPaying}
                        isLoading={isFigthing}
                        onClick={() => {
                          setIsFigthing(true);
                          onDecision(Action.Fight);
                        }}
                      >
                        Fight
                      </Button>
          
                      <Button
                        w="full"
                        px={["auto","20px"]}
                        isDisabled={isPaying || isFigthing}
                        isLoading={isRunning}
                        onClick={() => {
                          setIsRunning(true);
                          onDecision(Action.Run);
                        }}
                      >
                        Run
                      </Button>
                      <Button
                        w="full"
                        px={["auto","20px"]}
                        isDisabled={isRunning || isFigthing}
                        isLoading={isPaying}
                        onClick={() => {
                          setIsPaying(true);
                          onDecision(Action.Pay);
                        }}
                      >
                        PAY
                      </Button>
                    </Footer>
          )
           : ( 

          <Footer position={["fixed", "absolute"]} p={["8px !important", "0"]}>
          <Button
              w="full"
              px={["auto","20px"]}
              isDisabled={isDeclining}
              isLoading={isAccepting}
              onClick={() => {
                setIsAccepting(true);
                onDecision(Action.Accept);
              }}
            >
              Accept
            </Button>
            <Button
              w="full"
              px={["auto","20px"]}
              isDisabled={isAccepting}
              isLoading={isDeclining}
              onClick={() => {
                setIsDeclining(true);
                onDecision(Action.Decline);
              }}
            >
              Decline
            </Button>
          </Footer>
           )}

        </VStack>
      </HStack>
    </Layout>
  );
}

const Encounter = ({
  prefixTitle,
  title,
  demand,
  imageSrc,
  sentence,
  encounter,
  playerEntity,
  ...props
}: {
  prefixTitle?: string;
  title?: string;
  demand?: string;
  imageSrc: string;
  sentence: string;
  playerEntity: PlayerEntity;
  encounter: Encounter;
} & StyleProps) => {
  return (
    <VStack {...props}>
      <VStack>
        <Text textStyle="subheading" textAlign="center" fontSize={["10px", "11px"]} letterSpacing="0.25em">
          {prefixTitle}
        </Text>
        <Heading fontSize={["36px", "48px"]} fontWeight="400">
          {title}
        </Heading>
      </VStack>
      <VStack
        w="full"
        flexDir={["row", "column"]}
        justifyContent="center"
        alignItems={["flex-start", "center"]}
        position="relative"
      >
        {!IsMobile() && sentence && (
          <>
            <Box top="0" position="absolute" w="280px">
              <Box fontSize="14px" p="6px" color="neon.500" textAlign="center" mb="8px">
                {sentence}
              </Box>
              <Card marginLeft="160px" w="10px" fontSize="12px" p="8px"></Card>
              <Card marginLeft="180px" w="10px" fontSize="12px" p="6px"></Card>
            </Box>
          </>
        )}

        <Image
          src={imageSrc}
          alt="adverse event"
          mt={[0, "10px"]}
          maxH={["auto", "calc(100vh - 400px)"]}
          w={[160, "auto"]}
          h={[160, 400]}
        />

        <VStack w="full">
          <Card alignItems="center" w={["full", "auto"]} justify="center" mt={["20px", "40px"]}>
            <VStack w="full" gap="0">
              <HStack w="full" px="16px" py="8px" alignItems={["flex-start", "center"]} flexDir={["column", "row"]}>
                <HStack>
                  <Siren /> <Text> LVL {encounter.level}</Text>
                </HStack>
                {IsMobile() ? (
                  <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" />
                ) : (
                  <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                )}
                <CashIndicator cash={formatCash(encounter.payout)} />
                {IsMobile() ? (
                  <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" />
                ) : (
                  <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                )}
                <HealthIndicator
                  health={encounter.health}
                  maxHealth={getEncounterNPCMaxHealth(encounter.level, playerEntity.turn)}
                />
              </HStack>
              {!IsMobile() && (
                <Box w="full" px="10px">
                  <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" />
                  <Text color="yellow.400" textAlign="center" h="40px" lineHeight="40px">
                    {demand}
                  </Text>
                </Box>
              )}
            </VStack>
          </Card>
        </VStack>
      </VStack>
      {IsMobile() && (
        <Card w="full" color="yellow.400" textAlign="center" p="10px" mb="10px">
          {demand}
        </Card>
      )}
    </VStack>
  );
};

/// TODO: move this in a relevant place
function getEncounterNPCMaxHealth(level: number, turn: number) {
  // Calculate initial health based on level and turn.
  let health = level * 8 + turn;
  // Ensure health does not exceed 100.
  health = Math.min(health, 100);

  return health;
}
