import Button from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Inventory } from "@/components/Inventory";
import Layout from "@/components/Layout";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext, useSystems } from "@/dojo/hooks";
import { DrugConfigFull } from "@/dojo/stores/config";
import { DrugMarket } from "@/dojo/types";
import { formatCash } from "@/utils/ui";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  StyleProps,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const Location = observer(() => {
  const { router, gameId, location } = useRouterContext();
  const { account } = useDojoContext();

  const configStore = useConfigStore();
  const { game, gameInfos, gameEvents } = useGameStore();

  const [prices, setPrices] = useState<DrugMarket[]>([]);

  const { endGame, isPending } = useSystems();

  const [isLastDay, setIsLastDay] = useState(false);

  useEffect(() => {
    if (game && gameInfos && location) {
      // check if player at right location
      if (location?.location !== game.player.location?.location) {
        router.replace(`/${gameId}/${game.player.location?.location}`);
        return;
      }

      setIsLastDay(game.player.turn === gameInfos.max_turns);
    }
  }, [location, game, router, gameId, gameInfos, gameInfos?.max_turns]);

  useEffect(() => {
    if (game && game.markets.marketsByLocation && location) {
      setPrices(game.markets.marketsByLocation.get(location.location) || []);
    }
  }, [location, game]);

  if (!game || !prices || !location || !configStore) {
    return <></>;
  }

  const prefixTitle = isLastDay
    ? "Final Day"
    : `Day ${game.player.turn} ${gameInfos.max_turns === 0 ? "" : "/ " + gameInfos.max_turns}`;

  return (
    <Layout
      leftPanelProps={{
        title: location.name,
        prefixTitle: prefixTitle,
        imageSrc: `/images/locations/${location?.location.toLowerCase()}.png`,
      }}
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            isLoading={isPending}
            onClick={async () => {
              if (isLastDay) {
                try {
                  await endGame(gameId, game.getPendingCalls(), gameEvents?.playerName);
                } catch (e: any) {
                  game.clearPendingCalls();
                }
                router.push(`/${gameId}/end`);
              } else {
                router.push(`/${gameId}/travel`);
              }
            }}
          >
            {isLastDay ? "End Game" : "Continue"}
          </Button>
        </Footer>
      }
    >
      <Box w="full" zIndex="1" position="sticky" top="0" bg="neon.900" pb={"8px"}>
        <Inventory />
      </Box>

      <VStack w="full" align="flex-start" gap="10px">
        <SimpleGrid columns={2} w="full" gap={["10px", "16px"]} fontSize={["16px", "20px"]}>
          {prices.map((drug, index) => {
            const drugConfig = configStore.getDrug(drug.drug)!;

            // TODO : move in Player
            const canBuy =
              game.drugs.quantity === 0 ||
              !game.drugs?.drug ||
              (game.drugs?.drug?.drug === drug?.drug && game.player.cash > drug.price);
            const canSell = game.drugs.quantity > 0 && game.drugs?.drug?.drug === drug.drug;

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
                <CardBody>
                  <HStack w="full" justify="center">
                    <Flex
                      as={motion.div}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      p="2px"
                      align="center"
                      boxSize="full"
                      position="absolute"
                      pointerEvents={["none", "auto"]}
                    >
                      <HStack h="100px" w="full" p="20px" gap="10px" bgColor="neon.900">
                        <BuySellBtns canBuy={canBuy} canSell={canSell} drugConfig={drugConfig} />
                      </HStack>
                    </Flex>
                    {drugConfig.icon({})}
                  </HStack>
                </CardBody>

                <CardFooter fontSize={["14px", "16px"]} flexDirection="column" padding={["0 10px", "10px 20px"]}>
                  <HStack justifyContent="space-between">
                    <Text>{formatCash(drug.price)}</Text>
                  </HStack>
                  <BuySellMobileToggle canSell={canSell} canBuy={canBuy} drugConfig={drugConfig} />
                </CardFooter>
              </Card>
            );
          })}
          <Tooltip label={game.isShopOpen ? "Welcome Ser" : "Closed"}>
            <Card
              h={["auto", "180px"]}
              position="relative"
              cursor="pointer"
              opacity={game.isShopOpen ? 1 : 0.5}
              onClick={() => {
                if (game.isShopOpen ) {
                  router.push(`/${gameId}/pawnshop`);
                }
              }}
            >
              <CardHeader
                textTransform="uppercase"
                fontSize={["16px", "20px"]}
                textAlign="left"
                padding={["6px 10px", "10px 20px"]}
              >
                PAWNSHOP {game.isShopOpen ? "OPEN" : "CLOSED"}
              </CardHeader>
              <CardBody>
                <Image src="/images/pawnshop.png" width="100px" height="100px" />
              </CardBody>
            </Card>
          </Tooltip>
        </SimpleGrid>
      </VStack>
    </Layout>
  );
})

export default Location;

const BuySellBtns = ({
  canBuy,
  canSell,
  drugSlug,
  drugConfig,
}: {
  canBuy: boolean;
  canSell: boolean;
  drugConfig: DrugConfigFull;
}) => {
  const { router } = useRouterContext();
  return (
    <HStack mb="10px" w="full">
      <Button flex="1" onClick={() => router.push(`${router.asPath}/${drugConfig.drug}/buy`)} isDisabled={!canBuy}>
        Buy
      </Button>
      <Button flex="1" onClick={() => router.push(`${router.asPath}/${drugConfig.drug}/sell`)} isDisabled={!canSell}>
        Sell
      </Button>
    </HStack>
  );
};

const BuySellMobileToggle = ({
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
      <HStack
        as={motion.div}
        initial={{ height: "0", opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : "0",
          opacity: isOpen ? 1 : 0,
        }}
        boxSize="full"
        gap="10px"
        overflow="hidden"
        align="flex-start"
        display={["flex", "none"]}
        {...props}
      >
        <BuySellBtns canBuy={canBuy} canSell={canSell} drugConfig={drugConfig} />
      </HStack>
    </>
  );
};
