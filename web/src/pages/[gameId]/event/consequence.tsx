import { Button } from "@/components/common";
import { Heart } from "@/components/icons";
import { Reputation } from "@/components/icons/items/Reputation";
import { Footer, Layout } from "@/components/layout";
import { TravelEncounter, TravelEncounterResult } from "@/components/layout/GlobalEvents";
import { getOutcomeInfo } from "@/dojo/helpers";
import { useConfigStore, useGameStore, useRouterContext } from "@/dojo/hooks";
import { EncounterOutcomes, Encounters, OutcomeInfo } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { formatCash } from "@/utils/ui";
import { Box, Card, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ReactNode, useEffect, useState } from "react";

const Consequence = () => {
  const { router, gameId } = useRouterContext();
  const configStore = useConfigStore();
  const { game, gameEvents } = useGameStore();

  const [isDead, setIsDead] = useState(false);
  const [encounterResult, setEncounterResult] = useState<TravelEncounterResult | undefined>(undefined);
  const [outcomeInfos, setOutcomeInfos] = useState<OutcomeInfo | undefined>();

  useEffect(() => {
    if (!(game && gameEvents && gameEvents?.events && gameEvents?.lastEncounter && gameEvents?.lastEncounterResult))
      return;
    const encounterResultEvent = gameEvents?.lastEncounterResult.event as TravelEncounterResult;
    setEncounterResult(encounterResultEvent);
    const lastEncounterEvent = gameEvents?.lastEncounter.event as TravelEncounter;

    // console.log("***** CONSEQUENCES");
    // console.log("encounterResultEvent", encounterResultEvent);
    // console.log("lastEncounterEvent", lastEncounterEvent);

    const outcome = getOutcomeInfo(lastEncounterEvent.encounter as Encounters, encounterResultEvent.outcome);

    setOutcomeInfos(outcome);
  }, [game, gameEvents, gameEvents?.events, gameEvents?.lastEncounter, gameEvents?.lastEncounterResult]);

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
                  if (gameEvents.isGameOver) {
                    router.push(`/${gameId}/end`);
                  } else {
                    // Redirect to pawnshop or travel
                    if (game.isShopOpen) {
                      router.push(`/${gameId}/pawnshop`);
                    } else {
                      router.push(`/${gameId}/travel`);
                    }
                  }
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
        <VStack h="full" gap={[3, 6]} alignItems="center">
          <VStack>
            <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
              {outcomeInfos.title}
            </Text>
            <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
              {outcomeInfos.name}
            </Heading>
          </VStack>
          {/* <Image alt={outcomeInfos.name} src={outcomeInfos.imageSrc} maxH="30vh" height={[150, 280]} /> */}
          <VStack width="full" maxW="600px" h="100%" gap={[3, 6]} justifyContent="center">
            <Card p={3} minW="300px">
              <VStack alignItems="flex-start" gap={1}>
                {/* <Text>{JSON.stringify(encounterResult, 0, 2)}</Text> */}
                {[...Array(encounterResult.rounds)].map((i, idx) => {
                  return (
                    <Box key={`zz-${idx}`} w="full">
                      {encounterResult.dmg_dealt[idx] && (
                        <Line
                          icon={game.items.attack.icon({ color: "yellow.400" })}
                          text={
                            <Text color="yellow.400">
                              You hit for {encounterResult.dmg_dealt[idx][0].value} DMG{" "}
                              {encounterResult.dmg_dealt[idx][1].value > 0 && (
                                <>(-{encounterResult.dmg_dealt[idx][1].value})</>
                              )}
                            </Text>
                          }
                        />
                      )}

                      {encounterResult.dmg_taken[idx] && (
                        <Line
                          icon={<Heart color="red" />}
                          text={
                            <Text color="red">
                              You took {encounterResult.dmg_taken[idx][0].value} DMG{" "}
                              {encounterResult.dmg_taken[idx][1].value > 0 && (
                                <>(-{encounterResult.dmg_taken[idx][1].value})</>
                              )}
                            </Text>
                          }
                        />
                      )}

                      {encounterResult.drug_loss[idx] ? (
                        <Line
                          icon={configStore
                            .getDrugById(game.seasonSettings.drugs_mode, encounterResult.drug_id)
                            .icon({ color: "yellow.400", width: "24px", height: "24px" })}
                          text={
                            <Text color="yellow.400">
                              You lost {encounterResult.drug_loss[idx]}{" "}
                              {configStore.getDrugById(game.seasonSettings.drugs_mode, encounterResult.drug_id).name} on
                              the run
                            </Text>
                          }
                        />
                      ) : (
                        <></>
                      )}
                    </Box>
                  );
                })}

                {encounterResult.rep_pos > 0 && (
                  <Line icon={<Reputation />} text={<Text color="neon.400"> +{encounterResult.rep_pos} REP</Text>} />
                )}

                {encounterResult.rep_neg > 0 && (
                  <Line
                    icon={<Reputation color="yellow.400" />}
                    text={<Text color="yellow.400"> -{encounterResult.rep_neg} REP</Text>}
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

              {encounterResult.cash_earnt > 0 && (
                <Text color="yellow.400" textAlign="center">{`You confiscated ${formatCash(
                  encounterResult.cash_earnt,
                )}`}</Text>
              )}

              {encounterResult.cash_loss > 0 && (
                <Text color="yellow.400" textAlign="center">
                  You lost {formatCash(encounterResult.cash_loss)}
                </Text>
              )}

              {encounterResult.action === "Pay" && encounterResult.drug_loss.reduce((p, c) => p + c, 0) > 0 && (
                <Text color="yellow.400">
                  You lost {encounterResult.drug_loss.reduce((p, c) => p + c, 0)}{" "}
                  {configStore.getDrugById(game.seasonSettings.drugs_mode, encounterResult.drug_id).name}
                </Text>
              )}

              {encounterResult.turn_loss > 0 && (
                <Text color="yellow.400">
                  You spent {encounterResult.turn_loss} day{encounterResult.turn_loss > 1 ? "s" : ""} in{" "}
                  {outcomeInfos.encounterOutcome === "Hospitalized" ? "the hospital" : "jail"}!
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

const Line = ({ icon, text, ...props }: { icon: ReactNode; text: ReactNode }) => {
  return (
    <HStack w="full" gap={2} {...props}>
      {icon}
      {text}
    </HStack>
  );
};
