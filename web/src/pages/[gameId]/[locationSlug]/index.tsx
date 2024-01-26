import { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Spacer,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  SimpleGrid,
  StyleProps,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Cart } from "@/components/icons";
import { Footer } from "@/components/Footer";

import { formatQuantity, formatCash } from "@/utils/ui";
import { Inventory } from "@/components/Inventory";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { shortString } from "starknet";
import Button from "@/components/Button";
import { getDrugById, getLocationById, getLocationBySlug, sortDrugMarkets } from "@/dojo/helpers";
import { motion } from "framer-motion";
import { useSystems } from "@/dojo/hooks/useSystems";
import { DrugMarket } from "@/dojo/types";
import { usePlayerStore } from "@/dojo/hooks/usePlayerStore";
import { useConfigStore } from "@/dojo/hooks/useConfigStore";

export default function Location() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const locationId = getLocationBySlug(router.query.locationSlug as string)?.id || "";

  const { account } = useDojoContext();
  const { playerEntity } = usePlayerStore();
  const { config } = useConfigStore()

  const [prices, setPrices] = useState<DrugMarket[]>([]);
  useEffect(() => {
    if (playerEntity && playerEntity.markets) {
      setPrices(playerEntity.markets.get(locationId) || []);
    }
  }, [locationId, playerEntity, playerEntity?.markets]);

  const { endGame, isPending } = useSystems();

  const [isLastDay, setIsLastDay] = useState(false);

  useEffect(() => {
    if (playerEntity) {
      // check if player at right location
      if (locationId !== playerEntity.locationId) {
        router.replace(`/${gameId}/${getLocationById(playerEntity.locationId)?.slug}`);
        return;
      }

      setIsLastDay(playerEntity.maxTurns > 0 && playerEntity.turn >= playerEntity.maxTurns);
    }
  }, [locationId, playerEntity, playerEntity?.locationId, router, gameId]);

  if (!playerEntity || !prices) {
    return <></>;
  }

  const prefixTitle = isLastDay
    ? "Final Day"
    : `Day ${playerEntity.turn} ${playerEntity.maxTurns === 0 ? "" : "/ " + playerEntity.maxTurns}`;

  return (
    <Layout
      leftPanelProps={{
        title: getLocationById(locationId)!.name,
        prefixTitle: prefixTitle,
        imageSrc: `/images/locations/${getLocationById(locationId)?.slug}.png`,
      }}
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            isLoading={isPending}
            onClick={async () => {
              if (isLastDay) {
                await endGame(gameId);
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
          {sortDrugMarkets(prices).map((drug, index) => {
            const drugInfo = getDrugById(drug.id)!;
            const canBuy = drug.price <= playerEntity.cash && playerEntity.drugCount < playerEntity.getTransport();
            const canSell = !!playerEntity.drugs.find((d) => d.id === drug.id && d.quantity > 0);
            return (
              <Card h={["auto", "180px"]} key={index} position="relative">
                <CardHeader
                  textTransform="uppercase"
                  fontSize={["16px", "20px"]}
                  textAlign="left"
                  padding={["6px 10px", "10px 20px"]}
                >
                  {drugInfo.name}
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
                        <BuySellBtns canBuy={canBuy} canSell={canSell} drugSlug={drugInfo.slug} />
                      </HStack>
                    </Flex>
                    {drugInfo.icon({})}
                  </HStack>
                </CardBody>

                <CardFooter fontSize={["14px", "16px"]} flexDirection="column" padding={["0 10px", "10px 20px"]}>
                  <HStack justifyContent="space-between">
                    <Text>{formatCash(drug.price)}</Text>
                    {/* <HStack>
                      <Cart mb="4px" />
                      <Text marginInlineStart="0 !important">{formatQuantity(drug.marketPool.quantity)}</Text>
                    </HStack> */}
                  </HStack>
                  <BuySellMobileToggle canSell={canSell} canBuy={canBuy} drugSlug={drugInfo.slug} />
                </CardFooter>
              </Card>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Layout>
  );
}

const BuySellBtns = ({ canBuy, canSell, drugSlug }: { canBuy: boolean; canSell: boolean; drugSlug: string }) => {
  const router = useRouter();
  return (
    <HStack mb="10px" w="full">
      <Button flex="1" onClick={() => router.push(`${router.asPath}/${drugSlug}/buy`)} isDisabled={!canBuy}>
        Buy
      </Button>
      <Button flex="1" onClick={() => router.push(`${router.asPath}/${drugSlug}/sell`)} isDisabled={!canSell}>
        Sell
      </Button>
    </HStack>
  );
};

const BuySellMobileToggle = ({
  canBuy,
  canSell,
  drugSlug,
  ...props
}: {
  canBuy: boolean;
  canSell: boolean;
  drugSlug: string;
} & StyleProps) => {
  const router = useRouter();
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
        <BuySellBtns canBuy={canBuy} canSell={canSell} drugSlug={drugSlug} />
      </HStack>
    </>
  );
};
