import Image from "next/image";
import { useDojo } from "@/dojo";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { getLocationById } from "@/dojo/helpers";
import { useSystems } from "@/dojo/systems/useSystems";
import { Action, PlayerStatus } from "@/dojo/types";
import { usePlayerStore } from "@/hooks/state";
import { ConsequenceEventData } from "@/dojo/events";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Layout from "@/components/Layout";
import { Footer } from "@/components/Footer";
import Button from "@/components/Button";

const BASE_PAYMENT = 400;

export default function Decision() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const nextLocation = getLocationById(router.query.nextId as string);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { account } = useDojo();
  const { decide } = useSystems();
  const { addEncounter } = usePlayerStore();

  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  const onDecision = useCallback(
    async (action: Action) => {
      setIsSubmitting(true);
      const result = await decide(gameId, action, nextLocation.id);
      const event = result.event! as ConsequenceEventData;
      addEncounter(playerEntity!.status, event.outcome);

      router.replace(
        `/${gameId}/event/consequence?outcome=${event.outcome}&status=${
          playerEntity!.status
        }`,
      );
    },
    [gameId, nextLocation, router, playerEntity, addEncounter, decide],
  );

  if (!playerEntity || !router.isReady) {
    return <></>;
  }

  if (playerEntity.status == PlayerStatus.Normal && !isSubmitting) {
    return router.push(
      `/${gameId}/${getLocationById(playerEntity.locationId).slug}`,
    );
  }

  return (
    <>
      <Layout isSinglePanel>
        {playerEntity.status == PlayerStatus.BeingMugged && (
          <Encounter
            prefixTitle="You encountered a..."
            title="Gang!"
            demand={`Fend them off! You might lose some health`}
            imageSrc="/images/events/muggers.gif"
            cash={playerEntity.cash}
            run={() => onDecision(Action.Run)}
            fight={() => onDecision(Action.Fight)}
          />
        )}

        {playerEntity.status == PlayerStatus.BeingArrested && (
          <Encounter
            prefixTitle="You encountered the..."
            title="Cops!"
            demand={`Pay these cops off with ${
              playerEntity.cash * 0.2 < BASE_PAYMENT ? "$500" : "20%"
            } of your cash`}
            imageSrc="/images/events/cops.gif"
            cash={playerEntity.cash}
            run={() => onDecision(Action.Run)}
            pay={() => onDecision(Action.Pay)}
          />
        )}
      </Layout>
    </>
  );
}

const Encounter = ({
  prefixTitle,
  title,
  demand,
  imageSrc,
  cash,
  run,
  pay,
  fight,
}: {
  prefixTitle: string;
  title: string;
  demand: string;
  imageSrc: string;
  cash: number;
  run: () => void;
  pay?: () => void;
  fight?: () => void;
}) => {
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFighting, setIsFighting] = useState<boolean>(false);
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
      <Image src={imageSrc} alt="adverse event" width={500} height={500} />
      <VStack>
        <VStack textAlign="center">
          <Text>Better think fast...</Text>
          <Text color="yellow.400">* {demand} *</Text>
        </VStack>
        <Footer position={["absolute", "relative"]}>
          <Button
            w="full"
            isDisabled={isRunning || isPaying || isFighting}
            isLoading={isRunning}
            onClick={() => {
              setIsRunning(true);
              run();
            }}
          >
            Run
          </Button>
          {pay && (
            <Button
              w="full"
              isDisabled={
                isRunning || isPaying || isFighting || cash < BASE_PAYMENT
              }
              isLoading={isPaying}
              onClick={() => {
                setIsPaying(true);
                pay();
              }}
            >
              {cash >= BASE_PAYMENT ? "Pay" : "Not enough cash"}
            </Button>
          )}
          {fight && (
            <Button
              w="full"
              isDisabled={isRunning || isPaying || isFighting}
              isLoading={isPaying}
              onClick={() => {
                setIsFighting(true);
                fight();
              }}
            >
              Fight
            </Button>
          )}
        </Footer>
      </VStack>
    </>
  );
};
