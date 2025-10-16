import { Button } from "@/components/common";
import { CopsIcon, GangIcon } from "@/components/icons";
import { Kevlar, Knife, Shoes } from "@/components/icons/items";
import { Footer, Layout } from "@/components/layout";
import { TravelEncounter } from "@/components/layout/GlobalEvents";
import { EncounterPreview } from "@/components/pages/encounter/EncounterPreview";
import { HustlerPreviewFromGame } from "@/components/pages/profile/HustlerPreviewFromGame";
import { HustlerStats } from "@/components/pages/profile/HustlerStats";
import { CashIndicator, HealthIndicator } from "@/components/player";
import { ChildrenOrConnect } from "@/components/wallet";
import { GameClass } from "@/dojo/class/Game";
import { copsRanks, copsRanksKeys, gangRanks, gangRanksKeys, weaponIdToSound } from "@/dojo/helpers";
import { useGameStore, useRouterContext, useSystems } from "@/dojo/hooks";
import { Encounters, EncountersAction, PlayerStatus } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { formatCash, formatCashHeader } from "@/utils/ui";
import { Box, Card, Divider, Flex, HStack, Heading, Image, StyleProps, Text, VStack } from "@chakra-ui/react";
import { HustlerPreviewFromLoot } from "@/dope/components";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { num, shortString } from "starknet";
import { HustlerAvatarIcon } from "@/components/pages/profile/HustlerAvatarIcon";

const Decision = observer(() => {
  const { router, gameId } = useRouterContext();
  const { game, gameInfos, gameEvents } = useGameStore();
  const { decide, isPending } = useSystems();

  const [prefixTitle, setPrefixTitle] = useState("");
  const [title, setTitle] = useState("");
  const [demand, setDemand] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [encounterEvent, setEncounterEvent] = useState<TravelEncounter | undefined>(undefined);

  const [isPaying, setIsPaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFigthing, setIsFigthing] = useState(false);

  const [canPay, setCanPay] = useState(true);

  useEffect(() => {
    if (game && gameEvents) {
      const encounterEvent = gameEvents?.lastEncounter?.event as TravelEncounter;
      setEncounterEvent(encounterEvent);
    }
  }, [isPending, game, gameEvents, gameEvents?.lastEncounter]);

  useEffect(() => {
    if (game && gameEvents && encounterEvent) {
      switch (game.player.status) {
        case PlayerStatus.BeingMugged:
          setPrefixTitle("You encountered a...");
          setTitle("Gang!");
          const cashAmount = Math.floor((game.player.cash * encounterEvent!.demand_pct) / 100);
          setCanPay(cashAmount > 0);
          setDemand(`They want ${formatCash(cashAmount)} PAPER!`);

          break;
        case PlayerStatus.BeingArrested:
          setPrefixTitle("You encountered the...");
          setTitle("Cops!");
          const drugAmount = Math.floor((game.drugs.quantity * encounterEvent!.demand_pct) / 100);
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
  }, [game?.player.status]);

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
        playSound(weaponIdToSound(game?.items.attack.id || 0));

        break;
    }

    if (!game || !game.gameInfos || !game.gameInfos.minigame_token_id) {
      console.warn("onDecision: missing game or minigame_token_id");
      return;
    }

    const tokenId = game.gameInfos.minigame_token_id.toString();
    const { hash } = await decide(tokenId, action);
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
        h={["calc(100dvh - 70px)", "calc(100dvh - 120px)"]}
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
    encounterEvent: TravelEncounter;
  } & StyleProps) => {
    const { gameInfos } = useGameStore();
    const [imgUrl, setImgUrl] = useState<string | undefined>("");

    const [playerStatus, setPlayerStatus] = useState(PlayerStatus.Normal);

    useEffect(() => {
      if (game && playerStatus === PlayerStatus.Normal) {
        setPlayerStatus(game.player.status);
      }
    }, [game]);

    useEffect(() => {
      let url = "";
      if (playerStatus === PlayerStatus.BeingArrested) {
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
    }, [encounterEvent, playerStatus]);

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
          <HStack position="relative">
            <Image src={imgUrl} alt="adverse event" maxH={["30vh", "calc(100dvh - 300px)"]} w="auto" h={[150, 300]} />
          </HStack>

          <VStack w="320px" gap={[0, 3]}>
            <Card alignItems="center" w="full" justify="center">
              <VStack w="full" gap={0}>
                <HStack w="full" px="10px" py="6px" justifyContent="center">
                  <HStack flex="1" justifyContent="center" alignItems="center">
                    {encounterEvent.encounter === Encounters.Cops ? <CopsIcon /> : <GangIcon />}
                    <Text>
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
                    <HustlerAvatarIcon
                      gameId={gameInfos?.game_id}
                      // @ts-ignore
                      tokenId={gameInfos?.token_id}
                      // @ts-ignore
                      tokenIdType={gameInfos.token_id_type}
                    />
                    <Text>
                      {shortString.decodeShortString(num.toHexString(BigInt(game.gameInfos.player_name?.value)))}
                    </Text>
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

export const EncounterStats = observer(({ encounterEvent }: { encounterEvent: TravelEncounter }) => {
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

// HUSTLERS ENCOUNTERS VERSION
// <Box w="170px" h="160px" maxH={["30vh", "calc(100dvh - 300px)"]} transform={["", "scale(2)"]}>
//           {/* @ts-ignore */}
//           {gameInfos && (gameInfos.token_id_type === "LootId" || gameInfos.token_id_type === "GuestLootId") && (
//             <HustlerPreviewFromLoot tokenId={Number(gameInfos.token_id)} renderMode={0} />
//           )}
//           {/* @ts-ignore */}
//           {gameInfos && gameInfos.token_id_type === "HustlerId" && (
//             <HustlerPreviewFromGame
//               gameId={gameInfos?.game_id}
//               tokenId={Number(gameInfos.token_id)}
//               renderMode={0}
//             />
//           )}
//         </Box>
//         <Box
//           w="170px"
//           h="160px"
//           maxH={["30vh", "calc(100dvh - 300px)"]}
//           transform={["rotateY(180deg)", "scale(2) rotateY(170deg)"]}
//         >
//           <EncounterPreview
//             playerStatus={playerStatus}
//             level={encounterEvent.level}
//             gameId={gameInfos?.game_id}
//             turn={encounterEvent.turn}
//           />
//         </Box>
