import { Button } from "@/components/common";
import { Footer, Layout } from "@/components/layout";
import { TravelEncounterData, TravelEncounterResultData } from "@/dojo/events";
import { getOutcomeInfo } from "@/dojo/helpers";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { EncounterOutcomes, Encounters, OutcomeInfo } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { formatCash } from "@/utils/ui";
import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Consequence() {
  const { router, gameId } = useRouterContext();
  const { account } = useDojoContext();
  const configStore = useConfigStore();
  const { game, gameEvents } = useGameStore();

  const [isDead, setIsDead] = useState(false);
  const [encounterResult, setEncounterResult] = useState<TravelEncounterResultData | undefined>(undefined);
  const [outcomeInfos, setOutcomeInfos] = useState<OutcomeInfo | undefined>();

  //const response = useMemo(() => outcome?.getResponse(true), [outcome]);

  useEffect(() => {
    if (!(game && gameEvents)) return;

    const lastEncounter = gameEvents.getLastEncounter();
    const lastEncounterResult = gameEvents.getLastEncounterResult();
    lastEncounterResult && setEncounterResult(lastEncounterResult.parsed as TravelEncounterResultData);

    const outcome = getOutcomeInfo(
      (lastEncounter?.parsed as TravelEncounterData).encounterId as Encounters,
      (lastEncounterResult?.parsed as TravelEncounterResultData).outcome as EncounterOutcomes,
    );
    setOutcomeInfos(outcome);
  }, [game, gameEvents, gameEvents?.events]);

  useEffect(() => {
    if (encounterResult && encounterResult.outcome === EncounterOutcomes.Died) {
      setIsDead(true);
      playSound(Sounds.GameOver);
    }
  }, [encounterResult]);

  if (!router.isReady || !game || !gameEvents || !encounterResult || !outcomeInfos) {
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
                w={["full", "auto"]}
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
          <VStack>
            <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
              {outcomeInfos.title}
            </Text>
            <Heading fontSize={["36px", "48px"]} fontWeight="400" textAlign="center">
              {outcomeInfos.name}
            </Heading>
          </VStack>
          <Image alt={outcomeInfos.name} src={outcomeInfos.imageSrc} maxH="50vh" height="500px" />
          <VStack width="full" maxW="500px" h="100%" justifyContent="space-between">
            <VStack textAlign="center" gap={0}>
              {/* <Text>{response}</Text>*/}
              {encounterResult.rounds > 0 && (
                <Text>
                  After {encounterResult.rounds} attempt{encounterResult.rounds > 1 ? "s" : ""}
                </Text>
              )}
              <Text color="yellow.400">{outcomeInfos.description && `* ${outcomeInfos.description} *`}</Text>
              {encounterResult.cashEarnt > 0 && (
                <Text color="yellow.400">{`You confiscated ${formatCash(encounterResult.cashEarnt)}`}</Text>
              )}
              {encounterResult.cashLoss > 0 && <Text color="yellow.400">Cash loss : {formatCash(encounterResult.cashLoss)}</Text>}
              {encounterResult.dmgTaken > 0 && <Text color="red">Lost {encounterResult.dmgTaken} HP</Text>}
              {encounterResult.dmgDealt > 0 && <Text color="neon.400">Dealt {encounterResult.dmgDealt} DMG</Text>}
              {encounterResult.drugLoss > 0 && (
                <Text color="yellow.400">
                  Lost {encounterResult.drugLoss} {configStore.getDrugById(encounterResult.drugId).name}
                </Text>
              )}
              {encounterResult.turnLoss > 0 && (
                <Text color="yellow.400">
                  You spent {encounterResult.turnLoss} day{encounterResult.turnLoss > 1 ? "s" : ""} in{" "}
                  {outcomeInfos.encounterOutcome === EncounterOutcomes.Hospitalized ? "the hospital" : "in jail"}!
                </Text>
              )}

              {/* <Text>{JSON.stringify(encounterResult, null, 2)}</Text> */}
            </VStack>
          </VStack>
          <Box display="block" minH="70px" h="70px" w="full" />
        </VStack>
      </Layout>
    </>
  );
}
