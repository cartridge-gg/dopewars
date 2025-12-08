import { Button } from "@/components/common";
import { Cigarette } from "@/components/icons";
import { WeightIcon } from "@/components/icons/Weigth";
import { Footer, Layout } from "@/components/layout";
import { Inventory } from "@/components/player";
import { ChildrenOrConnect } from "@/components/wallet";
import { getRandomGreeting } from "@/dojo/helpers";
import { useConfigStore, useGameStore, useRouterContext, useSystems } from "@/dojo/hooks";
import { DrugMarket } from "@/dojo/types";
import { useToast } from "@/hooks/toast";
import { formatCash } from "@/utils/ui";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const Location = observer(() => {
  const { router, gameId, location } = useRouterContext();
  const { account } = useAccount();
  const { toast } = useToast();

  const configStore = useConfigStore();
  const { game, gameInfos, gameConfig, gameEvents } = useGameStore();
  const { endGame, isPending } = useSystems();

  const [prices, setPrices] = useState<DrugMarket[]>([]);
  const [isLastDay, setIsLastDay] = useState(false);
  const [greetings, setGreetings] = useState("");

  useEffect(() => {
    if (game && gameConfig && location && game.player.location?.location) {
      // check if player at right location
      if (location?.location !== game.player.location?.location) {
        // router.replace(`/${gameId}/${game.player.location?.location}`);
        router.push(`/${gameId}/${game.player.location?.location}`);
        return;
      }

      setGreetings(getRandomGreeting(game.player.turn));
      setIsLastDay(game.player.turn >= gameConfig.max_turns);
    }
  }, [location, game, router, gameId, gameConfig?.max_turns, game?.player.location]);

  useEffect(() => {
    if (game && game.markets.marketsByLocation && location) {
      setPrices(game.markets.marketsByLocation.get(location.location) || []);
    }
  }, [location, game]);

  if (!game || !gameInfos || !prices || !location || !configStore || !gameId) {
    return <></>;
  }

  // const prefixTitle = isLastDay
  //   ? "Final Day"
  //   : `Day ${game.player.turn} ${gameInfos.max_turns === 0 ? "" : "/ " + gameInfos.max_turns}`;

  return (
    <Layout
      leftPanelProps={{
        title: location.name,
        prefixTitle: greetings,
        imageSrc: `/images/locations/${location?.location.toLowerCase()}.png`,
      }}
      footer={
        <Footer>
          <ChildrenOrConnect>
            <Button
              w={["full", "auto"]}
              px={["auto", "20px"]}
              isLoading={isPending}
              onClick={async () => {
                if (game.drugs.quantity > 0 && isLastDay) {
                  toast({
                    message: "better sell this drugs before...",
                    icon: Cigarette,
                  });

                  return;
                }
                if (isLastDay) {
                  try {
                    await endGame(gameId, game.getPendingCalls());
                    router.push(`/${gameId}/end`);
                  } catch (e: any) {
                    game.clearPendingCalls();
                  }
                } else {
                  router.push(`/${gameId}/travel`);
                }
              }}
            >
              {isLastDay ? "End Game" : "Continue"}
            </Button>
          </ChildrenOrConnect>
        </Footer>
      }
    >
      <VStack /*h="100%"*/ w="full" alignItems="center" justifyContent="center" gap={[6, 9]}>
        <Box w="full" zIndex="1" bg="neon.900">
          <Inventory />
        </Box>

        <VStack w="full" align="flex-start" gap="10px">
          <SimpleGrid columns={2} w="full" gap={["10px", "16px"]} fontSize={["16px", "20px"]}>
            {prices.map((drug, index) => {
              const drugConfig = configStore.getDrug(game.seasonSettings.drugs_mode, drug.drug)!;

              const freeSpace = game.items.transport.stat - game.drugs.quantity * (game.drugs?.drug?.weight || 0);
              const hasFreeSpace = freeSpace >= drug.weight;
              const hasMinCash = game.player.cash >= drug.price;

              const canBuy =
                hasFreeSpace &&
                hasMinCash &&
                (game.drugs.quantity === 0 || !game.drugs?.drug || game.drugs?.drug?.drug === drug!.drug);

              const canSell =
                (game.drugs.quantity > 0 && game.drugs?.drug && game.drugs?.drug?.drug === drug!.drug) || false;

              const handleCardClick = () => {
                // Navigate to the drug trade screen
                if (canBuy || canSell) {
                  router.push(`${router.asPath}/${drugConfig.drug}`);
                }
              };

              const isClickable = canBuy || canSell;

              // Determine error message
              let errorMessage = null;
              if (!isClickable) {
                if (!hasFreeSpace) {
                  errorMessage = "Not enough inventory space.";
                } else if (!hasMinCash) {
                  errorMessage = "Not enough cash.";
                } else {
                  errorMessage = "Cannot trade this item.";
                }
              }

              return (
                <Tooltip key={index} label={errorMessage} isDisabled={isClickable} hasArrow color="yellow.400">
                  <Card
                    h={["auto", "180px"]}
                    position="relative"
                    onClick={handleCardClick}
                    cursor={isClickable ? "pointer" : "not-allowed"}
                    opacity={isClickable ? 1 : 0.5}
                    _hover={isClickable ? { borderColor: "neon.600" } : {}}
                    transition="all 0.2s"
                  >
                    <CardHeader
                      textTransform="uppercase"
                      fontSize={["16px", "20px"]}
                      textAlign="left"
                      padding={["6px 10px", "10px 20px"]}
                    >
                      {drugConfig.name}
                    </CardHeader>
                    <CardBody py="0">
                      <HStack w="full" justify="center">
                        {drugConfig.icon({})}
                      </HStack>
                    </CardBody>

                    <CardFooter fontSize={["14px", "16px"]} flexDirection="column" padding={["6px 10px", "10px 20px"]}>
                      <HStack justifyContent="space-between">
                        <Text>
                          <WeightIcon mb={1} />
                          <span>{drug.weight}</span>
                        </Text>
                        <Text> {formatCash(drug.price)}</Text>
                      </HStack>
                    </CardFooter>
                  </Card>
                </Tooltip>
              );
            })}
          </SimpleGrid>
        </VStack>
      </VStack>
    </Layout>
  );
});

export default Location;
