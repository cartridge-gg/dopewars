import { Button } from "@/components/common";
import { Cigarette, Heart } from "@/components/icons";
import { Footer, Layout } from "@/components/layout";
import { TravelEncounterData, TravelEncounterResultData } from "@/dojo/events";
import { getOutcomeInfo } from "@/dojo/helpers";
import { useConfigStore, useGameStore, useRouterContext } from "@/dojo/hooks";
import { EncounterOutcomes, Encounters, EncountersAction, OutcomeInfo } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { formatCash } from "@/utils/ui";
import { Box, Card, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { ReactNode, useEffect, useState } from "react";

const Consequence = () => {
  const { router, gameId } = useRouterContext();
  const { account } = useAccount();
  const configStore = useConfigStore();
  const { game, gameEvents } = useGameStore();

  const [isDead, setIsDead] = useState(false);
  const [encounterResult, setEncounterResult] = useState<TravelEncounterResultData | undefined>(undefined);
  const [outcomeInfos, setOutcomeInfos] = useState<OutcomeInfo | undefined>();

  //const response = useMemo(() => outcome?.getResponse(true), [outcome]);

  useEffect(() => {
    if (!(game && gameEvents && gameEvents?.events && gameEvents?.lastEncounter && gameEvents?.lastEncounterResult))
      return;

    setEncounterResult(gameEvents?.lastEncounterResult.parsed as TravelEncounterResultData);

    const outcome = getOutcomeInfo(
      (gameEvents?.lastEncounter.parsed as TravelEncounterData).encounterId as Encounters,
      (gameEvents?.lastEncounterResult?.parsed as TravelEncounterResultData).outcome as EncounterOutcomes,
    );
    setOutcomeInfos(outcome);
  }, [game, gameEvents, gameEvents?.sortedEvents, gameEvents?.lastEncounter, gameEvents?.lastEncounterResult]);

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
        <VStack h="full" gap={6}>
          <VStack>
            <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
              {outcomeInfos.title}
            </Text>
            <Heading fontSize={["36px", "48px"]} fontWeight="400" textAlign="center">
              {outcomeInfos.name}
            </Heading>
          </VStack>
          <Image alt={outcomeInfos.name} src={outcomeInfos.imageSrc} maxH="30vh" height="280px" />
          <VStack width="full" maxW="600px" h="100%" gap={6}>
            <Card p={3} minW="300px">
              <VStack alignItems="flex-start" gap={1}>
                {/* <Text>{JSON.stringify(encounterResult, 0, 2)}</Text> */}
                {[...Array(encounterResult.rounds)].map((i, idx) => {
                  return (
                    <>
                      {encounterResult.dmgDealt[idx] && (
                        <Line
                          icon={game.items.attack.icon({ color: "yellow.400" })}
                          text={
                            <Text color="yellow.400">
                              You hit for {encounterResult.dmgDealt[idx][0]} DMG{" "}
                              {encounterResult.dmgDealt[idx][1] > 0 && <>(+{encounterResult.dmgDealt[idx][1]})</>}
                            </Text>
                          }
                        />
                      )}

                      {encounterResult.dmgTaken[idx] && (
                        <Line
                          icon={<Heart color="red" />}
                          text={
                            <Text color="red">
                              You took {encounterResult.dmgTaken[idx][0]} DMG{" "}
                              {encounterResult.dmgTaken[idx][1] > 0 && <>(-{encounterResult.dmgTaken[idx][1]})</>}
                            </Text>
                          }
                        />
                      )}

                      {encounterResult.drugLoss[idx] && (
                        <Line
                          icon={configStore
                            .getDrugById(encounterResult.drugId)
                            .icon({ color: "yellow.400", width: "24px", height: "24px" })}
                          text={
                            <Text color="yellow.400">
                              You lost {encounterResult.drugLoss[idx]}{" "}
                              {configStore.getDrugById(encounterResult.drugId).name} on the run
                            </Text>
                          }
                        />
                      )}
                    </>
                  );
                })}

                {encounterResult.escapedWithItem && (
                  <Line
                    icon={game.items.speed.icon({ color: "neon.400" })}
                    text={<Text color="neon.400">Your {game.items.speed.base.name} was decisive on this run</Text>}
                  />
                )}

                {encounterResult.repPos > 0 && (
                  <Line icon={<Cigarette />} text={<Text color="neon.400">REP +{encounterResult.repPos}</Text>} />
                )}

                {encounterResult.repNeg > 0 && (
                  <Line
                    icon={<Cigarette color="yellow.400" />}
                    text={<Text color="yellow.400">REP -{encounterResult.repNeg}</Text>}
                  />
                )}
              </VStack>
            </Card>

            <VStack alignItems="center" gap={1}>
              {/* <Text>{outcomeInfos.getResponse(true)}</Text> */}

              {/* RESULT */}

              <Text color="yellow.400" textAlign="center">
                {outcomeInfos.description && `* ${outcomeInfos.description} *`}
              </Text>

              {encounterResult.cashEarnt > 0 && (
                <Text color="yellow.400" textAlign="center">{`You confiscated ${formatCash(
                  encounterResult.cashEarnt,
                )}`}</Text>
              )}

              {encounterResult.cashLoss > 0 && (
                <Text color="yellow.400" textAlign="center">
                  You lost {formatCash(encounterResult.cashLoss)}
                </Text>
              )}

              {encounterResult.action === EncountersAction.Pay &&
                encounterResult.drugLoss.reduce((p, c) => p + c, 0) > 0 && (
                  <Text color="yellow.400">
                    You lost {encounterResult.drugLoss.reduce((p, c) => p + c, 0)}{" "}
                    {configStore.getDrugById(encounterResult.drugId).name}
                  </Text>
                )}

              {encounterResult.turnLoss > 0 && (
                <Text color="yellow.400">
                  You spent {encounterResult.turnLoss} day{encounterResult.turnLoss > 1 ? "s" : ""} in{" "}
                  {outcomeInfos.encounterOutcome === EncounterOutcomes.Hospitalized ? "the hospital" : "jail"}!
                </Text>
              )}
            </VStack>
          </VStack>
          <Box display="block" minH="70px" h="70px" w="full" />
        </VStack>
      </Layout>
    </>
  );
};

export default observer(Consequence);

const Line = ({ icon, text }: { icon: ReactNode; text: ReactNode }) => {
  return (
    <HStack w="full" gap={2}>
      {icon}
      {text}
    </HStack>
  );
};
