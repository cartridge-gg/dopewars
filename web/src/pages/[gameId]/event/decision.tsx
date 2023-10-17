import Image from "next/image";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { usePlayerEntity, ShopItem, PlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { getLocationById } from "@/dojo/helpers";
import { useSystems } from "@/dojo/hooks/useSystems";
import { Action, ItemTextEnum, Outcome, PlayerStatus } from "@/dojo/types";
import { usePlayerStore } from "@/hooks/state";
import { ConsequenceEventData } from "@/dojo/events";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Footer } from "@/components/Footer";
import Button from "@/components/Button";
import { useToast } from "@/hooks/toast";
import { Heart } from "@/components/icons";
import { playSound, Sounds } from "@/hooks/sound";
import { iconByTypeAndLevel } from "@/pages/[gameId]/pawnshop";


export default function Decision() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const nextLocation = getLocationById(router.query.nextId as string);
  const [status, setStatus] = useState<PlayerStatus>();
  const [prefixTitle, setPrefixTitle] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [demand, setDemand] = useState<string>();
  const [penalty, setPenalty] = useState<string>();
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
 
  const { toast } = useToast();
  const { account } = useDojoContext();
  const { decide, isPending } = useSystems();
  const { addEncounter } = usePlayerStore();

  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });


  useEffect(() => {
    if (playerEntity && !isPending) {
      switch (PlayerStatus[playerEntity.status]) {
        case PlayerStatus.BeingMugged:
          setPrefixTitle("You encountered a...");
          setTitle("Gang!");
          setDemand(`They want 50% of your $PAPER!`);
          break;
        case PlayerStatus.BeingArrested:
          setPrefixTitle("You encountered the...");
          setTitle("Cops!");
          setDemand(`They want 20% of your DRUGS!`);
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

  const onDecision = useCallback(
    async (action: Action) => {
      try {
        setPenalty("");

        const result = await decide(gameId, action, nextLocation!.type);
        const event = result.event! as ConsequenceEventData;
        addEncounter(playerEntity!.status, event.outcome);

        switch (event.outcome) {
          case Outcome.Died:
            toast({
              message: `You too ${event.healthLoss}HP damage and died...`,
              icon: Heart,
              link: `http://amazing_explorer/${result.hash}`,
            });
            setIsRedirecting(true);
            return router.push(`/${gameId}/end`);

          case Outcome.Paid:
          case Outcome.Escaped:
            setIsRedirecting(true);
            return router.replace(
              `/${gameId}/event/consequence?outcome=${event.outcome}&status=${
                playerEntity!.status
              }`,
            );

          case Outcome.Captured:
            setPrefixTitle("Your escape...");
            setTitle("Failed!");
            setPenalty(`You lost ${event.healthLoss}HP!`);
            toast({
              message: `You were captured and lost ${event.healthLoss}HP!`,
              icon: Heart,
              link: `http://amazing_explorer/${result.hash}`,
            });
            break;
        }
      } catch (e) {
        console.log(e);
      }
    },
    [gameId, nextLocation, router, playerEntity, addEncounter, decide, toast],
  );

  if (!playerEntity || !router.isReady || isRedirecting) {
    return <></>;
  }

  if (playerEntity.status == PlayerStatus.Normal && !isPending) {
    router.push(`/${gameId}/turn`);
    // router.push(
    //   `/${gameId}/${getLocationById(playerEntity.locationId)!.slug}`,
    // );
    return <></>;
  }

  return (
    <Layout isSinglePanel>
      <Encounter
        prefixTitle={prefixTitle}
        title={title}
        demand={demand}
        imageSrc={`/images/events/${
          status == PlayerStatus.BeingMugged ? "muggers.gif" : "cops.gif"
        }`}
        penalty={penalty}
        isSubmitting={isPending}
        playerEntity={playerEntity}
        onRun={() => onDecision(Action.Run)}
        onPay={() => onDecision(Action.Pay)}
        onFight={() => onDecision(Action.Fight)}
      />
    </Layout>
  );
}

const Encounter = ({
  prefixTitle,
  title,
  demand,
  imageSrc,
  penalty,
  isSubmitting,
  onPay,
  onRun,
  onFight,
  playerEntity
}: {
  prefixTitle?: string;
  title?: string;
  demand?: string;
  imageSrc: string;
  penalty?: string;
  isSubmitting?: boolean;
  onPay: () => void;
  onRun: () => void;
  onFight: () => void;
  playerEntity: PlayerEntity;
}) => {


  const [attackItem, setAttackItem] = useState<ShopItem|undefined>(undefined);
  const [speedItem, setSpeedItem] = useState<ShopItem|undefined>(undefined);

  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFigthing, setIsFigthing] = useState<boolean>(false);

  useEffect(() => {
    setAttackItem(playerEntity.items.find(i => i.id === ItemTextEnum.Attack));
    setSpeedItem(playerEntity.items.find(i => i.id === ItemTextEnum.Speed));
  
  }, [playerEntity]);

  useEffect(() => {
    if (!isSubmitting) {
      setIsPaying(false);
      setIsRunning(false);
      setIsFigthing(false);
    }
  }, [isSubmitting]);
  return (
    <>
      <VStack>
        <Text
          textStyle="subheading"
          fontSize={["10px", "11px"]}
          letterSpacing="0.25em"
        >
          {prefixTitle}
        </Text>
        <Heading fontSize={["40px", "48px"]} fontWeight="400">
          {title}
        </Heading>
      </VStack>
      <Image
        src={imageSrc}
        alt="adverse event"
        width={400}
        height={400}
        style={{ opacity: isSubmitting ? 0.5 : 1 }}
      />
      <VStack width="full" maxW="500px" h="100%" justifyContent="space-between">
        <VStack h="60px" textAlign="center">
          {isSubmitting ? (
            <>
              {isRunning && <Text>You split without a second thought</Text>}
              {isPaying && <Text>You decided to pay up</Text>}
              {isFigthing && <Text>Bouyakaaa</Text>}
            </>
          ) : (
            <>
              <Text>{demand}</Text>
              <Text color="red">{penalty}</Text>
            </>
          )}
        </VStack>
        <Footer position={["relative", "relative"]}>
        
         {attackItem && (
          <Button
          w="full"
          isDisabled={isRunning || isPaying }
          isLoading={isFigthing}
          onClick={() => {
            setIsFigthing(true);
            onFight();
          }}
          >
          Fight{iconByTypeAndLevel[attackItem.id][attackItem.level]({
                        boxSize: "26",
                      })} 
          </Button>
          )}
       
        <Button
            w="full"
            isDisabled={isPaying || isFigthing}
            isLoading={isRunning}
            onClick={() => {
              setIsRunning(true);
              onRun();
            }}
          >
            Run{speedItem && iconByTypeAndLevel[speedItem.id][speedItem.level]({
                        boxSize: "26",
                      })} 
          </Button>
          <Button
            w="full"
            isDisabled={isRunning || isFigthing}
            isLoading={isPaying}
            onClick={() => {
              setIsPaying(true);
              onPay();
            }}
          >
            PAY
          </Button>
        </Footer>
      </VStack>
    </>
  );
};
