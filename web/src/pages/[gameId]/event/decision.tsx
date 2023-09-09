import CrtEffect from "@/components/CrtEffect";
import Header from "@/components/Header";
import { useDojo } from "@/hooks/dojo";
import {
  PlayerStatus,
  usePlayerEntity,
} from "@/hooks/dojo/entities/usePlayerEntity";
import { useSystems } from "@/hooks/dojo/systems/useSystems";
import { Action, usePlayerStore } from "@/hooks/state";
import { getLocationById } from "@/hooks/ui";
import { ConsequenceEventData } from "@/utils/event";
import { Button, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

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
    [gameId, nextLocation, router, decide],
  );

  if (!playerEntity) {
    return <></>;
  }

  if (playerEntity.status == PlayerStatus.Normal && !isPaying && !isRunning) {
    return router.push(
      `/${gameId}/${getLocationById(playerEntity.locationId).slug}`,
    );
  }

  return (
    <>
      <Header />
      <VStack
        position="fixed"
        top="0"
        left="0"
        boxSize="full"
        align="center"
        justify="center"
        gap="20px"
      >
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
        <Image src="/images/muggers.gif" alt="muggers" />
        <HStack w="400px">
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
            isDisabled={isRunning || isPaying}
            isLoading={isPaying}
            onClick={async () => {
              setIsPaying(true);
              onDecision(Action.Pay);
            }}
          >
            Pay
          </Button>
        </HStack>
      </VStack>
      <CrtEffect />
    </>
  );
}
