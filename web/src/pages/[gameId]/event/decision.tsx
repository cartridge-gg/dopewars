import CrtEffect from "@/components/CrtEffect";
import Image from "next/image";
import { useDojo } from "@/dojo";
import { PlayerStatus, usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { getLocationById } from "@/dojo/helpers";
import { useSystems } from "@/dojo/systems/useSystems";
import { Action } from "@/dojo/types";
import { usePlayerStore } from "@/hooks/state";
import { ConsequenceEventData } from "@/dojo/events";
import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Layout from "@/components/Layout";
import { Footer } from "@/components/Footer";

const BASE_PAYMENT = 400;

export default function Decision() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const nextLocation = getLocationById(router.query.nextId as string);
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const { account } = useDojo();
  const { decide } = useSystems();
  const { addOutcome } = usePlayerStore();

  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  const onDecision = useCallback(
    async (action: Action) => {
      const result = await decide(gameId, action, nextLocation.id);
      const event = result.event! as ConsequenceEventData;
      addOutcome(event.outcome);

      router.replace(`/${gameId}/event/consequence?outcome=${event.outcome}`);
    },
    [gameId, nextLocation, router, addOutcome, decide],
  );

  if (!playerEntity || !router.isReady) {
    return <></>;
  }

  if (playerEntity.status == PlayerStatus.Normal && !isPaying && !isRunning) {
    return router.push(
      `/${gameId}/${getLocationById(playerEntity.locationId).slug}`,
    );
  }

  return (
    <>
      <Layout isSinglePanel={true}>
        <VStack>
          <Text
            textStyle="subheading"
            fontSize={["10px", "11px"]}
            letterSpacing="0.25em"
          >
            You encountered a...
          </Text>
          <Heading fontSize={["40px", "48px"]} fontWeight="400">
            Gang!
          </Heading>
        </VStack>
        <Image
          src="/images/muggers.gif"
          alt="muggers"
          width={500}
          height={500}
        />
        <VStack maxWidth="500px">
          <VStack textAlign="center">
            <Text>Better think fast...</Text>
            <Text color="yellow.400">
              * They are demanding at least{" "}
              {playerEntity.cash * 0.2 < BASE_PAYMENT ? "$400" : "20%"} of your
              cash *
            </Text>
          </VStack>
          <Footer position={["absolute", "relative"]}>
            <Button
              w="full"
              isDisabled={isRunning || isPaying}
              isLoading={isRunning}
              onClick={async () => {
                setIsRunning(true);
                onDecision(Action.Run);
              }}
            >
              Run
            </Button>
            <Button
              w="full"
              isDisabled={
                isRunning || isPaying || playerEntity.cash < BASE_PAYMENT
              }
              isLoading={isPaying}
              onClick={async () => {
                setIsPaying(true);
                onDecision(Action.Pay);
              }}
            >
              {playerEntity.cash >= BASE_PAYMENT ? "Pay" : "Not enough cash"}
            </Button>
          </Footer>
        </VStack>
      </Layout>
      <CrtEffect />
    </>
  );
}
