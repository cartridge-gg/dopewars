import { Button } from "@/components/common";
import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { CopsIcon, GangIcon } from "@/components/icons";
import { Kevlar, Knife, Shoes } from "@/components/icons/items";
import { Footer, Layout } from "@/components/layout";
import { HustlerStats } from "@/components/pages/profile/HustlerStats";
import { CashIndicator, HealthIndicator } from "@/components/player";
import { ChildrenOrConnect } from "@/components/wallet";
import { GameClass } from "@/dojo/class/Game";
import { TravelEncounterData } from "@/dojo/events";
import {
  copsRanks,
  copsRanksKeys,
  gangRanks,
  gangRanksKeys,
  reputationRanks,
  reputationRanksKeys,
} from "@/dojo/helpers";
import { useDojoContext, useGameStore, useRouterContext, useSystems } from "@/dojo/hooks";

import { Encounters, EncountersAction, PlayerStatus } from "@/dojo/types";

import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { getSentence } from "@/responses";
import colors from "@/theme/colors";
import { IsMobile, formatCash, formatCashHeader } from "@/utils/ui";
import { Box, Card, Divider, HStack, Heading, Image, StyleProps, Text, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { shortString } from "starknet";

type CombatLog = {
  text: string;
  color: string;
  icon?: React.FC;
};

const Decision = observer(() => {
  const { router, gameId } = useRouterContext();
  const { account } = useAccount();
  const { game, gameInfos, gameEvents } = useGameStore();
  const { decide, isPending } = useSystems();
  const { configStore } = useDojoContext();

  const [prefixTitle, setPrefixTitle] = useState("");
  const [title, setTitle] = useState("");
  const [demand, setDemand] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [encounterEvent, setEncounterEvent] = useState<TravelEncounterData | undefined>(undefined);

  const [isPaying, setIsPaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFigthing, setIsFigthing] = useState(false);

  const [canPay, setCanPay] = useState(true);

  const toaster = useToast();

  const isMobile = IsMobile();

  useEffect(() => {
    if (game && gameEvents ) {
      const encounterEvent = gameEvents?.lastEncounter!.parsed as TravelEncounterData;
      setEncounterEvent(encounterEvent);
    }
  }, [isPending, game, gameEvents, gameEvents?.lastEncounter]);

  useEffect(() => {
   
    if (game && gameEvents && encounterEvent) {
      switch (game.player.status) {
        case PlayerStatus.BeingMugged:
          setPrefixTitle("You encountered a...");
          setTitle("Gang!");
          const cashAmount = Math.ceil((game.player.cash * encounterEvent!.demandPct) / 100);
          setCanPay(cashAmount > 0);
          setDemand(`They want ${formatCash(cashAmount)} PAPER!`);

          break;
        case PlayerStatus.BeingArrested:
          setPrefixTitle("You encountered the...");
          setTitle("Cops!");
          const drugAmount = Math.ceil((game.drugs.quantity * encounterEvent!.demandPct) / 100);
          const drugName = game.drugs.drug?.name || "you";
          setCanPay(drugAmount > 0);
          setDemand(`They want ${drugAmount ? drugAmount : ""} ${drugName}!`);

          break;
      }
    }
  }, [game, gameEvents, game?.player.status, encounterEvent]);

  useEffect(() => {
    if (game?.player.status == PlayerStatus.BeingArrested) {
      playSound(Sounds.Police);
    }
    if (game?.player.status == PlayerStatus.BeingMugged) {
      playSound(Sounds.Gang);
    }
  }, [game, game?.player.status]);

  useEffect(() => {
    if (!isPending) {
      setIsPaying(false);
      setIsRunning(false);
      setIsFigthing(false);
    }
  }, [isPending]);

  const onDecision = async (action: EncountersAction) => {
    //  play sound

    switch (action) {
      case EncountersAction.Pay:
        playSound(Sounds.Pay);
        break;
      case EncountersAction.Run:
        playSound(Sounds.Run);
        break;
      case EncountersAction.Fight:
        switch (gameInfos?.hustler_id) {
          case 0:
            playSound(Sounds.Uzi);
            break;
          case 1:
            playSound(Sounds.Chains);
            break;
          case 2:
            playSound(Sounds.Punch);
            break;
          default:
            playSound(Sounds.Punch);
            break;
        }
        break;
    }

    //try {
    const { event, events, isGameOver } = await decide(gameId!, action);
    // if (isGameOver) {
    //   router.replace(`/${gameId}/end`);
    // } else {
    if (event) {
      router.push(`/${gameId}/event/consequence`);
    }
    // }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  if (!game || !router.isReady || isRedirecting || !encounterEvent) {
    return <></>;
  }

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer w={["100%", "50%"]}>
          <ChildrenOrConnect>
            <Button
              w="full"
              px={["auto", "20px"]}
              isDisabled={isRunning || isPaying}
              isLoading={isFigthing}
              onClick={() => {
                setIsFigthing(true);
                onDecision(EncountersAction.Fight);
              }}
            >
              Fight
            </Button>

            <Button
              w="full"
              px={["auto", "20px"]}
              isDisabled={isPaying || isFigthing}
              isLoading={isRunning}
              onClick={() => {
                setIsRunning(true);
                onDecision(EncountersAction.Run);
              }}
            >
              Run
            </Button>

            <Button
              w="full"
              px={["auto", "20px"]}
              isDisabled={isRunning || isFigthing || !canPay}
              isLoading={isPaying}
              onClick={() => {
                setIsPaying(true);
                onDecision(EncountersAction.Pay);
              }}
            >
              PAY
            </Button>
          </ChildrenOrConnect>
        </Footer>
      }
    >
      <VStack
        w="full"
        h={["calc(100vh - 70px)", "calc(100vh - 120px)"]}
        overflowY="scroll"
        sx={{
          "scrollbar-width": "none",
        }}
      >
        <Encounter
          prefixTitle={prefixTitle}
          title={title}
          demand={demand}
          encounterEvent={encounterEvent!}
          game={game}
          flex={[0, 1]}
          mb={0}
          w="full"
        />
        <Box minH="100px" />
      </VStack>
    </Layout>
  );
});
export default Decision;

const Encounter = observer(
  ({
    prefixTitle,
    title,
    demand,
    encounterEvent,
    game,
    ...props
  }: {
    prefixTitle?: string;
    title?: string;
    demand?: string;
    game: GameClass;
    encounterEvent: TravelEncounterData;
  } & StyleProps) => {
    const { gameInfos } = useGameStore();

    const [imgUrl, setImgUrl] = useState<string | undefined>("");

    useEffect(() => {
      let url = "";
      if (game.player.status === PlayerStatus.BeingArrested) {
        url = `/images/events/cops/${encounterEvent.level}.gif`;
      } else {
        url = `/images/events/gang/${encounterEvent.level}.gif`;
      }

      if (url === "/images/events/cops/6.gif") {
        setImgUrl("/images/events/cops/6-intro.gif");
        setTimeout(() => {
          setImgUrl(url);
        }, 1500);
      } else {
        setImgUrl(url);
      }
    }, [encounterEvent, /*game.player.status*/]);

    return (
      <VStack {...props}>
        <VStack>
          <Text textStyle="subheading" textAlign="center" fontSize={["10px", "11px"]} letterSpacing="0.25em">
            {prefixTitle}
          </Text>
          <Heading fontSize={["30px", "48px"]} fontWeight="400">
            {title}
          </Heading>
        </VStack>
        <VStack
          w="full"
          h="full"
          flexDir={["column", "row"]}
          justifyContent="center"
          alignItems="center"
          position="relative"
          gap={[2, 12]}
        >
          <Image
            src={imgUrl}
            alt="adverse event"
            // mt={[0, "100px"]}
            maxH={["30vh", "calc(100vh - 300px)"]}
            w="auto"
            h={[150, 300]}
          />

          <VStack w="320px" gap={[0, 3]}>
            {/* <Card alignItems="center" w={"auto"} justify="center">
              <HStack w="full" px="16px" py="8px" justifyContent="center">
                <Text>id: {encounter?.id}</Text>
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <Text>
                  min/max rep: {encounter?.min_rep}/{encounter?.max_rep}
                </Text>
              </HStack>
            </Card> */}

            <Card alignItems="center" w="full" justify="center">
              <VStack w="full" gap={0}>
                <HStack w="full" px="10px" py="6px" justifyContent="center">
                  <HStack flex="1" justifyContent="center" alignItems="center">
                    {encounterEvent.encounter === Encounters.Cops ? <CopsIcon /> : <GangIcon />}
                    <Text>
                      {/* {encounter?.encounter} lvl {encounter?.level} */}
                      {encounterEvent?.encounter === Encounters.Cops
                        ? copsRanks[encounterEvent?.level as copsRanksKeys]
                        : gangRanks[encounterEvent?.level as gangRanksKeys]}
                    </Text>
                  </HStack>
                  <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                  <CashIndicator cash={formatCash(encounterEvent?.payout)} flex="1" justifyContent="center" />
                </HStack>

                <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" />

                <EncounterStats encounterEvent={encounterEvent} />
              </VStack>

              <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" />

              <Text textAlign="center" h="40px" lineHeight="40px">
                {demand}
              </Text>
            </Card>

            <Text opacity={0.5}> VS </Text>

            <Card alignItems="center" w="full" justify="center" color="yellow.400">
              <VStack w="full" gap={0}>
                <HStack w="full" px="10px" py="6px" justifyContent="space-between">
                  <HStack w="full" justifyContent="center">
                    <HustlerIcon hustler={gameInfos?.hustler_id as Hustlers} color={colors.yellow["400"].toString()} />
                    {/* <Text>{reputationRanks[game.player.drugLevel as reputationRanksKeys]}</Text> */}
                    <Text>{shortString.decodeShortString(game.gameInfos.player_name?.value)}</Text>
                  </HStack>

                  <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />

                  {encounterEvent?.encounter === Encounters.Cops ? (
                    <HStack w="full" justify="center" fontSize={["14px", "16px"]}>
                      {game.drugs.quantity === 0 && <Text color="neon.500">No product</Text>}
                      {game.drugs.quantity > 0 && game.drugs.drug && (
                        <>
                          {game.drugs.drug?.icon({ boxSize: "26" })}
                          <Text>{game.drugs.quantity}</Text>
                        </>
                      )}
                    </HStack>
                  ) : (
                    <HStack w="full" justify="center">
                      <CashIndicator cash={formatCashHeader(game.player.cash)} />
                    </HStack>
                  )}
                </HStack>
              </VStack>
              <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" />
              <HustlerStats />
            </Card>
          </VStack>
        </VStack>
      </VStack>
    );
  },
);

export const EncounterStats = observer(({ encounterEvent }: { encounterEvent: TravelEncounterData }) => {
  if (!encounterEvent) return null;
  return (
    <HStack flexDirection="row" w="full" px="10px" py="6px" justifyContent="center">
      <HStack flex="1">
        <Knife /> <Text>{encounterEvent.attack}</Text>
      </HStack>
      <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
      <HStack flex="1">
        <Kevlar />
        <Text>{encounterEvent.defense}</Text>
      </HStack>
      <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
      <HStack flex="1">
        <Shoes /> <Text>{encounterEvent.speed}</Text>
      </HStack>
      <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
      <HealthIndicator health={encounterEvent?.health} maxHealth={encounterEvent?.health} flex="1" />
    </HStack>
  );
});

// /// TODO: move this in a relevant place
// function getEncounterNPCMaxHealth(level: number, turn: number) {
//   // Calculate initial health based on level and turn.
//   let health = level * 8 + turn;
//   // Ensure health does not exceed 100.
//   health = Math.min(health, 100);

//   return health;
// }
