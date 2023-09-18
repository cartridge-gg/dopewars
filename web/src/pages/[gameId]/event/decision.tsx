import Image from "next/image";
import { useDojo } from "@/dojo";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { getLocationById } from "@/dojo/helpers";
import { useSystems } from "@/dojo/systems/useSystems";
import { Action, Outcome, PlayerStatus } from "@/dojo/types";
import { usePlayerStore } from "@/hooks/state";
import { ConsequenceEventData } from "@/dojo/events";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { Footer } from "@/components/Footer";
import Button from "@/components/Button";
import { formatCash } from "@/utils/ui";
import { useToast } from "@/hooks/toast";
import { Heart } from "@/components/icons";
import { playSound, Sounds } from "@/hooks/sound";

const COPS_DRUG_THRESHOLD = 5;

export default function Decision() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const nextLocation = getLocationById(router.query.nextId as string);
  const [status, setStatus] = useState<PlayerStatus>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [prefixTitle, setPrefixTitle] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [demand, setDemand] = useState<string>();
  const [penalty, setPenalty] = useState<string>();

  const { toast } = useToast();
  const { account } = useDojo();
  const { decide } = useSystems();
  const { addEncounter } = usePlayerStore();

  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  useEffect(() => {
    if (playerEntity && !isSubmitting) {
      switch (playerEntity.status) {
        case PlayerStatus.BeingMugged:
          setPrefixTitle("You encountered a...");
          setTitle("Gang!");
          setDemand(`They want 20% of your DRUGS and $PAPER!`);
          break;
        case PlayerStatus.BeingArrested:
          const payment = formatCash(copsPayment(playerEntity.drugCount));
          setPrefixTitle("You encountered the...");
          setTitle("Cops!");
          setDemand(
            `You're carrying DRUGS! These dirty cops are demanding ${payment} PAPER!`,
          );
          break;
      }

      setStatus(playerEntity.status);
    }
  }, [playerEntity, isSubmitting]);

  const canPay = useMemo(() => {
    if (playerEntity && playerEntity.status == PlayerStatus.BeingArrested) {
      return playerEntity.cash >= copsPayment(playerEntity.drugCount);
    }
    return true;
  }, [playerEntity]);

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
      setIsSubmitting(true);
      setPenalty("");

      const result = await decide(gameId, action, nextLocation!.id);
      const event = result.event! as ConsequenceEventData;
      addEncounter(playerEntity!.status, event.outcome);

      switch (event.outcome) {
        case Outcome.Captured:
          setIsSubmitting(false);
          setPrefixTitle("Your escape...");
          setTitle("Failed!");
          setPenalty(`You loss ${event.healthLoss}HP!`);
          toast(
            `You were captured and loss ${event.healthLoss}HP!`,
            Heart,
            `http://amazing_explorer/${result.hash}`,
          );
          break;

        case Outcome.Died:
          toast(
            `You too ${event.healthLoss}HP damage and died...`,
            Heart,
            `http://amazing_explorer/${result.hash}`,
          );
          return router.push(`/${gameId}/end`);

        case Outcome.Escaped:
        case Outcome.Paid:
          return router.replace(
            `/${gameId}/event/consequence?outcome=${event.outcome}&status=${
              playerEntity!.status
            }`,
          );
      }
    },
    [gameId, nextLocation, router, playerEntity, addEncounter, decide, toast],
  );

  if (!playerEntity || !router.isReady) {
    return <></>;
  }

  if (playerEntity.status == PlayerStatus.Normal && !isSubmitting) {
    return router.push(
      `/${gameId}/${getLocationById(playerEntity.locationId)!.slug}`,
    );
  }

  return (
    <>
      <Layout isSinglePanel>
        <Encounter
          prefixTitle={prefixTitle}
          title={title}
          demand={demand}
          canPay={canPay}
          imageSrc={`/images/events/${
            status == PlayerStatus.BeingMugged ? "muggers.gif" : "cops.gif"
          }`}
          penalty={penalty}
          isSubmitting={isSubmitting}
          onRun={() => onDecision(Action.Run)}
          onPay={() => onDecision(Action.Pay)}
        />
      </Layout>
    </>
  );
}

const copsPayment = (drugCount: number) => {
  if (drugCount < COPS_DRUG_THRESHOLD + 20) {
    return 1000;
  } else if (drugCount < COPS_DRUG_THRESHOLD + 50) {
    return 5000;
  } else if (drugCount < COPS_DRUG_THRESHOLD + 80) {
    return 10000;
  } else {
    return 20000;
  }
};

const Encounter = ({
  prefixTitle,
  title,
  demand,
  imageSrc,
  penalty,
  canPay,
  isSubmitting,
  onPay,
  onRun,
}: {
  prefixTitle?: string;
  title?: string;
  demand?: string;
  imageSrc: string;
  penalty?: string;
  canPay: boolean;
  isSubmitting?: boolean;
  onPay: () => void;
  onRun: () => void;
}) => {
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isSubmitting) {
      setIsPaying(false);
      setIsRunning(false);
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
      <VStack width="500px">
        <VStack h="60px" textAlign="center">
          {isSubmitting ? (
            <>
              {isRunning && <Text>You split without a second thought</Text>}
              {isPaying && <Text>You decided to pay up</Text>}
            </>
          ) : (
            <>
              <Text>{demand}</Text>
              <Text color="red">{penalty}</Text>
            </>
          )}
        </VStack>
        <Footer position={["absolute", "relative"]}>
          <Button
            w="full"
            isDisabled={isRunning || isPaying}
            isLoading={isRunning}
            onClick={() => {
              setIsRunning(true);
              onRun();
            }}
          >
            Run
          </Button>
          <Button
            w="full"
            isDisabled={isPaying || isRunning || !canPay}
            isLoading={isPaying}
            onClick={() => {
              setIsPaying(true);
              onPay();
            }}
          >
            {canPay ? "PAY" : "Not enough $PAPER"}
          </Button>
        </Footer>
      </VStack>
    </>
  );
};
