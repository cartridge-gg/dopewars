import { Button } from "@/components/common";
import { Cigarette } from "@/components/icons";
import { WeightIcon } from "@/components/icons/Weigth";
import { Footer, Layout } from "@/components/layout";
import { Inventory } from "@/components/player";
import { ChildrenOrConnect } from "@/components/wallet";
import { getRandomGreeting } from "@/dojo/helpers";
import { useConfigStore, useGameStore, useRouterContext, useSystems } from "@/dojo/hooks";
import { DrugConfigFull } from "@/dojo/stores/config";
import { DrugMarket } from "@/dojo/types";
import { useToast } from "@/hooks/toast";
import { formatCash } from "@/utils/ui";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  SimpleGrid,
  StyleProps,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { motion } from "framer-motion";
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

              return (
                <Card h={["auto", "180px"]} key={index} position="relative">
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
                      <Flex
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        p="2px"
                        alignItems="center"
                        boxSize="full"
                        position="absolute"
                        top={"6px"}
                        pointerEvents={["none", "auto"]}
                      >
                        <HStack w="full" px={3} gap={6} /*bgColor="neon.900"*/>
                          <BuySellBtns canBuy={canBuy} canSell={canSell} drugConfig={drugConfig} />
                        </HStack>
                      </Flex>
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
                    <BuySellMobileToggle canSell={canSell} canBuy={canBuy} drugConfig={drugConfig} />
                  </CardFooter>
                </Card>
              );
            })}
          </SimpleGrid>
        </VStack>
      </VStack>

      {/* <Box h="160px" /> */}
    </Layout>
  );
});

export default Location;

const BuySellBtns = observer(
  ({ canBuy, canSell, drugConfig }: { canBuy: boolean; canSell: boolean; drugConfig: DrugConfigFull }) => {
    const { router } = useRouterContext();
    return (
      <HStack mb="10px" bg="neon.900" w="full" /*gap="65px"*/>
        <Button flex="1" onClick={() => router.push(`${router.asPath}/${drugConfig.drug}/buy`)} isDisabled={!canBuy}>
          Buy
        </Button>
        <Button flex="1" onClick={() => router.push(`${router.asPath}/${drugConfig.drug}/sell`)} isDisabled={!canSell}>
          Sell
        </Button>
      </HStack>
    );
  },
);

const BuySellMobileToggle = observer(
  ({
    canBuy,
    canSell,
    drugConfig,
    ...props
  }: {
    canBuy: boolean;
    canSell: boolean;
    drugConfig: DrugConfigFull;
  } & StyleProps) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
      <>
        <Box boxSize="full" position="absolute" top="0" left="0" onClick={onToggle} pointerEvents={["auto", "none"]} />
        <Box
          as={motion.div}
          initial={{ height: "0", opacity: 0 }}
          animate={{
            height: isOpen ? "auto" : "0",
            opacity: isOpen ? 1 : 0,
          }}
          position="absolute"
          width="90%"
          bottom="0px"
          left="5%"
          gap="10px"
          overflow="hidden"
          // align="flex-start"
          display={["flex", "none"]}
          {...props}
        >
          <BuySellBtns canBuy={canBuy} canSell={canSell} drugConfig={drugConfig} />
        </Box>
      </>
    );
  },
);
