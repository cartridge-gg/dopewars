import Button from "@/components/Button";
import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { TravelEncounterResultData } from "@/dojo/generated/contractEvents";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { Outcome } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { formatCash } from "@/utils/ui";
import { Box, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Consequence() {
  const { router, gameId } = useRouterContext();
  const { account } = useDojoContext();
  const configStore = useConfigStore();
  const { game, gameEvents } = useGameStore();

  const [isDead, setIsDead] = useState(false);
  const [encounterResult, setEncounterResult] = useState<TravelEncounterResultData | undefined>(undefined);

  //const response = useMemo(() => outcome?.getResponse(true), [outcome]);

  useEffect(() => {
    if (!(game && gameEvents)) return;
    // const outcomeInfos = getOutcomeInfo(router.query.status as PlayerStatus, Number(router.query.outcome));
    // setOutcome(outcomeInfos);
    // if (router.query.payout) {
    //   setPayout(Number(router.query.payout));
    // }
    const lastEncounterResult = gameEvents.getLastEncounterResult();
    lastEncounterResult && setEncounterResult(lastEncounterResult.parsed);
  }, [gameEvents, gameEvents?.events]);

  useEffect(() => {
    if (encounterResult && encounterResult.outcome === Outcome.Died) {
      setIsDead(true);
      playSound(Sounds.GameOver);
    }
  }, [encounterResult]);

  if (!router.isReady || !game || !gameEvents || !encounterResult) {
    return <></>;
  }

  return (
    <>
      <Layout
        isSinglePanel
        footer={
          <Footer>
            {!isDead ? (
              <Button
                w={["full", "auto"]}
                px={["auto", "20px"]}
                onClick={() => {
                  router.push(`/${gameId}/${game.player.location.location}`);
                }}
              >
                Continue
              </Button>
            ) : (
              <Button
                w="full"
                px={["auto", "20px"]}
                onClick={() => {
                  router.push(`/${gameId}/end`);
                }}
              >
                Game Over
              </Button>
            )}
          </Footer>
        }
      >
        <VStack h="full">
          {/* <VStack>
            <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
              {outcome.title}
            </Text>
            <Heading fontSize={["36px", "48px"]} fontWeight="400" textAlign="center">
              {outcome.name}
            </Heading>
          </VStack>
          <Image alt={outcome.name} src={outcome.imageSrc} maxH="50vh" height="500px" /> */}
          <VStack width="full" maxW="500px" h="100%" justifyContent="space-between">
            <VStack textAlign="center">
              <Text>{JSON.stringify(encounterResult, null, 2)}</Text>
              {/* <Text>{response}</Text>
              <Text color="yellow.400">{outcome.description && `* ${outcome.description} *`}</Text> */}
              <Text color="yellow.400">
                {encounterResult.payout > 0 && `You confiscated ${formatCash(encounterResult.payout)}`}
              </Text>
            </VStack>
          </VStack>
          <Box display="block" minH="70px" h="70px" w="full" />
        </VStack>
      </Layout>
    </>
  );
}
