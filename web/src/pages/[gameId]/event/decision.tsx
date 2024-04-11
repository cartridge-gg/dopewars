import { Button } from "@/components/common";
import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { CopsIcon, GangIcon, Siren } from "@/components/icons";
import { Footer, Layout } from "@/components/layout";
import { CashIndicator, HealthIndicator } from "@/components/player";
import { ChildrenOrConnect } from "@/components/wallet";
import { GameClass } from "@/dojo/class/Game";
import { TravelEncounterData } from "@/dojo/events";
import { useDojoContext, useGameStore, useRouterContext, useSystems } from "@/dojo/hooks";
import { Encounters, EncountersAction, PlayerStatus } from "@/dojo/types";
import { EncounterConfig } from "@/generated/graphql";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { getSentence } from "@/responses";
import { IsMobile, formatCash } from "@/utils/ui";
import { Box, Card, Divider, HStack, Heading, Image, StyleProps, Text, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

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
  const [encounter, setEncounter] = useState<EncounterConfig | undefined>(undefined);
  const [encounterImg, setEncounterImg] = useState<string>("");

  const [isPaying, setIsPaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFigthing, setIsFigthing] = useState(false);

  const [sentence, setSentence] = useState("");

  const [canPay, setCanPay] = useState(true);

  const toaster = useToast();

  const isMobile = IsMobile();

  useEffect(() => {
    if (game && gameEvents && !isPending) {
      const encounterEvent = gameEvents?.lastEncounter!.parsed as TravelEncounterData;
      const encounter = configStore.getEncounterById(encounterEvent.encounterId);
      setEncounter(encounter);
    }
  }, [game, isPending, gameEvents, gameEvents?.lastEncounter]);

  useEffect(() => {
    if (game && gameEvents && encounter && !isPending) {
      switch (game.player.status) {
        case PlayerStatus.BeingMugged:
          setPrefixTitle("You encountered a...");
          setTitle("Gang!");
          const cashAmount = Math.ceil((game.player.cash * encounter!.demand_pct) / 100);
          setCanPay(cashAmount > 0);
          encounter && setDemand(`They want ${formatCash(cashAmount)} PAPER!`);
          setSentence(getSentence(PlayerStatus.BeingMugged, EncountersAction.Fight));
          setEncounterImg(`/images/events/gang/${encounter.level}.gif`);
          break;
        case PlayerStatus.BeingArrested:
          setPrefixTitle("You encountered the...");
          setTitle("Cops!");
          const drugAmount = Math.ceil((game.drugs.quantity * encounter!.demand_pct) / 100);
          const drugName = game.drugs.drug?.name || "you";
          setCanPay(drugAmount > 0);
          encounter && setDemand(`They want ${drugAmount ? drugAmount : ""} ${drugName}!`);
          setSentence(getSentence(PlayerStatus.BeingArrested, EncountersAction.Fight));
          setEncounterImg(`/images/events/cops/${encounter.level}.gif`);
          break;
      }
    }
  }, [game, gameEvents, game?.player.status, encounter, isPending]);

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

  if (!game || !router.isReady || isRedirecting || !encounter) {
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
          sentence={sentence}
          encounter={encounter!}
          game={game}
          imageSrc={encounterImg}
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
    imageSrc,
    sentence,
    encounter,
    game,
    ...props
  }: {
    prefixTitle?: string;
    title?: string;
    demand?: string;
    imageSrc: string;
    sentence: string;
    game: GameClass;
    encounter: EncounterConfig;
  } & StyleProps) => {
    const { gameInfos } = useGameStore();

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
          // flexDir={["row", "column"]}
          justifyContent="center"
          alignItems={"center"}
          position="relative"
        >
          {/* {!IsMobile() && sentence && (
            <>
              <Box top="0" position="absolute" w="280px">
                <Box fontSize="14px" p="6px" color="neon.500" textAlign="center" mb="8px">
                  {sentence}
                </Box>
                <Card marginLeft="185px" w="10px" fontSize="12px" p="8px"></Card>
                <Card marginLeft="170px" w="10px" fontSize="12px" p="6px"></Card>
              </Box>
            </>
          )} */}

          <Image
            src={imageSrc}
            alt="adverse event"
            // mt={[0, "100px"]}
            maxH={["30vh", "calc(100vh - 300px)"]}
            w="auto"
            h={[150, 300]}
          />

          <VStack w="full" mt={[0, "20px"]}>
            {/* <Text color="red" h="40px" lineHeight="40px">
            <Heart /> You lost {encounter?.healthLoss} HP!
          </Text> */}

            {/* <Card alignItems="center" w={"auto"} justify="center">
              <HStack w="full" px="16px" py="8px" justifyContent="center">
                <Text>id: {encounter?.id}</Text>
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <Text>
                  min/max rep: {encounter?.min_rep}/{encounter?.max_rep}
                </Text>
              </HStack>
            </Card> */}

            <Card alignItems="center" w={"auto"} justify="center">
              <HStack w="full" px="16px" py="8px" justifyContent="center">
                <HStack>
                  <Siren /> <Text> LVL {encounter?.level}</Text>{" "}
                </HStack>
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <CashIndicator cash={formatCash(encounter?.payout)} />
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <HealthIndicator health={encounter?.health} maxHealth={100} />
              </HStack>
              {/* {!IsMobile() && ( */}
              <Box w="full" px="10px">
                <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" />
                <Text color="yellow.400" textAlign="center" h="40px" lineHeight="40px">
                  {demand}
                </Text>
              </Box>
              {/* )} */}
            </Card>

            <Card alignItems="center" w={"auto"} justify="center">
              {/* <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" /> */}
              <HStack w="full" px="16px" py="8px" justifyContent="center">
                {encounter.encounter === Encounters.Cops ? <CopsIcon /> : <GangIcon />}
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <Text>ATK {encounter.attack}</Text>
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <Text>DEF {encounter.defense}</Text>
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <Text>SPD {encounter.speed}</Text>
              </HStack>
            </Card>

            <Text> VS </Text>

            <Card alignItems="center" w={"auto"} justify="center" color="yellow.400">
              <HStack w="full" px="16px" py="8px" justifyContent="center">
                <HustlerIcon hustler={gameInfos?.hustler_id as Hustlers} />
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <Text>ATK {game?.items.attack.tier.stat}</Text>
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <Text>DEF {game?.items.defense.tier.stat}</Text>
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <Text>SPD {game?.items.speed.tier.stat}</Text>
              </HStack>
            </Card>
          </VStack>
        </VStack>

        {/* {IsMobile() && (
          <Card w="full" color="yellow.400" textAlign="center" p="10px" mb="10px">
            {demand}
          </Card>
        )} */}
      </VStack>
    );
  },
);

// /// TODO: move this in a relevant place
// function getEncounterNPCMaxHealth(level: number, turn: number) {
//   // Calculate initial health based on level and turn.
//   let health = level * 8 + turn;
//   // Ensure health does not exceed 100.
//   health = Math.min(health, 100);

//   return health;
// }
