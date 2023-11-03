import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { ShopItem, PlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { getLocationById, getShopItem } from "@/dojo/helpers";
import { useSystems } from "@/dojo/hooks/useSystems";
import { Action, ItemTextEnum, Outcome, PlayerStatus } from "@/dojo/types";
import { usePlayerStore } from "@/hooks/state";
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
import { IsMobile } from "@/utils/ui";
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

export default function Decision() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const healthLoss = router.query.healthLoss as string;

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

  const [combatLogs, setCombatLogs] = useState<CombatLog[]>([]);
  const [sentence, setSentence] = useState("");

  const toaster = useToast();
  const { decide, isPending } = useSystems();
  const { addEncounter } = usePlayerStore();

  const { playerEntity } = playerEntityStore;

  const combatsListRef = useRef(null);

  useEffect(() => {
    if (playerEntity && !isPending) {
      switch (PlayerStatus[playerEntity.status]) {
        case PlayerStatus.BeingMugged:
          setPrefixTitle("You encountered a...");
          setTitle("Gang!");
          setDemand(`They want 20% of your $PAPER!`);
          setSentence(getSentence(PlayerStatus.BeingMugged, Action.Fight));
          break;
        case PlayerStatus.BeingArrested:
          setPrefixTitle("You encountered the...");
          setTitle("Cops!");
          setDemand(`They want 20% of your DRUGS!`);
          setSentence(getSentence(PlayerStatus.BeingArrested, Action.Fight));
          break;
      }

      setStatus(playerEntity.status);
    }
  }, [playerEntity, isPending]);

  useEffect(() => {
    if (status == PlayerStatus.BeingArrested) {
      playSound(Sounds.Police);
    }
    if (status == PlayerStatus.BeingMugged) {
      playSound(Sounds.Gang);
    }
  }, [status]);

  useEffect(() => {
    if (playerEntity && playerEntity.items) {
      setAttackItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Attack));
      setSpeedItem(playerEntity.items.find((i) => i.id === ItemTextEnum.Speed));
    }
  }, [playerEntity?.items]);

  useEffect(() => {
    if (playerEntity && playerEntity.encounters && !isPending) {
      if (status === PlayerStatus.BeingMugged) {
        setEncounter(playerEntity.encounters.find((i) => i.encounter_id === "Gang"));
      }
      if (status === PlayerStatus.BeingArrested) {
        setEncounter(playerEntity.encounters.find((i) => i.encounter_id === "Cops"));
      }
    }
  }, [playerEntity?.encounters, status, isPending]);

  useEffect(() => {
    if (!isPending) {
      setIsPaying(false);
      setIsRunning(false);
      setIsFigthing(false);
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
      addEncounter(playerStatus!, consequenceEvent.outcome);

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
      <HStack w="full" h="full" flexDir={["column", "row"]}>
        <Encounter
          prefixTitle={prefixTitle}
          title={title}
          demand={demand}
          sentence={sentence}
          encounter={encounter!}
          imageSrc={`/images/events/${status == PlayerStatus.BeingMugged ? "muggers.gif" : "cops.gif"}`}
          flex={[0, 1]}
          mb={["20px", "0"]}
          w="full"
        />

        <VStack flex={[0, 1]} w="full" h="100%" position="relative">
          <Inventory />

          <VStack w="full" h="100%" overflowY="scroll">
            <VStack w="full" alignItems="flex-start">
              <Text textStyle="subheading" mt={["10px", "30px"]} fontSize="10px" color="neon.500">
                Combat Log
              </Text>
              <Card w="full" maxH="calc( 100vh - 400px)" overflowY="scroll" alignItems="flex-start" px="16px" py="8px">
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
          <Box minH="60px" />

          <Footer w="full" position={["relative", "absolute"]}>
            {/* {attackItem && ( */}
            <Button
              w="full"
              isDisabled={isRunning || isPaying}
              isLoading={isFigthing}
              onClick={() => {
                setIsFigthing(true);
                onDecision(Action.Fight);
              }}
            >
              {/* {getShopItem(attackItem.id, attackItem.level).icon({
                  boxSize: "26",
                })} */}
              Fight
            </Button>
            {/* )} */}

            <Button
              w="full"
              isDisabled={isPaying || isFigthing}
              isLoading={isRunning}
              onClick={() => {
                setIsRunning(true);
                onDecision(Action.Run);
              }}
            >
              {/* {speedItem &&
                getShopItem(speedItem.id, speedItem.level).icon({
                  boxSize: "26",
                })} */}
              Run
            </Button>
            <Button
              w="full"
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
  ...props
}: {
  prefixTitle?: string;
  title?: string;
  demand?: string;
  imageSrc: string;
  sentence: string;
  encounter: Encounter;
} & StyleProps) => {
  return (
    <VStack {...props}>
      <VStack>
        <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
          {prefixTitle}
        </Text>
        <Heading fontSize={["40px", "48px"]} fontWeight="400">
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
              <Card fontSize="14px" p="6px" color="neon.500" textAlign="center" mb="8px">
                {sentence}
              </Card>
              <Card marginLeft="160px" w="10px" fontSize="12px" p="8px"></Card>
              <Card marginLeft="180px" w="10px" fontSize="12px" p="6px"></Card>
            </Box>
          </>
        )}

        <Image src={imageSrc} alt="adverse event" mt={[0, "10px"]} w={[160, 400]} h={[160, 400]} />

        <VStack w="full">
          <Card alignItems="center" w={["full","auto"]} justify="center" mt={["20px", "50px"]}>
            <HStack w="full" px="16px" py="8px" alignItems={["flex-start", "center"]} flexDir={["column", "row"]}>
              <HStack>
                <Siren /> <Text> LVL {encounter.level}</Text>
              </HStack>
              {IsMobile() ? (
                <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" />
              ) : (
                <Divider h="10px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
              )}
              <CashIndicator cash={encounter.payout} />
              {IsMobile() ? (
                <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" />
              ) : (
                <Divider h="10px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
              )}
              <HealthIndicator health={encounter.health} />
            </HStack>
          </Card>
          {!IsMobile() && (
            <Text color="yellow.400" textAlign="center">
              {demand}
            </Text>
          )}
        </VStack>
      </VStack>
      {IsMobile() && (
        <Text color="yellow.400" textAlign="center">
          {demand}
        </Text>
      )}
    </VStack>
  );
};
