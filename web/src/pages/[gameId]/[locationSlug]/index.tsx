import { useEffect } from "react";
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
import { useLocationEntity } from "@/dojo/queries/useLocationEntity";
import { usePlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { formatQuantity, formatCash } from "@/utils/ui";
import { Inventory } from "@/components/Inventory";
import { useGameEntity } from "@/dojo/queries/useGameEntity";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { shortString } from "starknet";
import Button from "@/components/Button";
import {
  getDrugById,
  getLocationById,
  getLocationBySlug,
  sortDrugMarkets,
} from "@/dojo/helpers";
import { motion } from "framer-motion";

export default function Location() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const locationId = getLocationBySlug(router.query.locationSlug as string)?.id;
  const { account } = useDojoContext();
  const { location: locationEntity } = useLocationEntity({
    gameId,
    locationId,
  });
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const { game: gameEntity } = useGameEntity({
    gameId,
  });

  useEffect(() => {
    if (playerEntity && locationId) {
      // check if player at right location
      if (locationId !== playerEntity.locationId) {
        router.replace(
          `/${gameId}/${getLocationById(playerEntity.locationId)?.slug}`,
        );
        return;
      }
    }
  }, [locationId, playerEntity, router, gameId]);
  if (!playerEntity || !locationEntity || !gameEntity) {
    return <></>;
  }

  const prefixTitle =
    playerEntity.turnsRemaining === 0
      ? "Final Day"
      : `Day ${gameEntity.maxTurns - playerEntity.turnsRemaining + 1} / ${
          gameEntity.maxTurns
        }`;

  return (
    <Layout
      leftPanelProps={{
        title: locationEntity.id,
        prefixTitle: prefixTitle,
        imageSrc: `/images/locations/${
          getLocationById(locationEntity.id)?.slug
        }.png`,
      }}
    >
      <Inventory />
      <VStack
        w="full"
        pt={["0px", "20px"]}
        align="flex-start"
        gap="12px"
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Text textStyle="subheading" fontSize="10px" color="neon.500">
          Market
        </Text>
        <SimpleGrid columns={2} w="full" gap={["10px","16px"]} fontSize={["16px","20px"]}>
          {sortDrugMarkets(locationEntity.drugMarkets).map((drug, index) => {
            const drugInfo = getDrugById(drug.id)!;
            const canBuy =
              drug.price <= playerEntity.cash &&
              playerEntity.drugCount < playerEntity.bagLimit;
            const canSell = !!playerEntity.drugs.find(
              (d) => d.id === drug.id && d.quantity > 0,
            );
            return (
              <Card h={["auto", "180px"]} key={index} position="relative">
                <CardHeader
                  textTransform="uppercase"
                  fontSize={["16px","20px"]}
                  textAlign="left"
                  padding={["6px 10px","10px 20px"]}
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
                      <HStack
                        h="100px"
                        w="full"
                        p="20px"
                        gap="10px"
                        bgColor="neon.900"
                      >
                        <BuySellBtns
                          canBuy={canBuy}
                          canSell={canSell}
                          drugSlug={drugInfo.slug}
                        />
                      </HStack>
                    </Flex>
                    {drugInfo.icon({})}
                  </HStack>
                </CardBody>
               
                <CardFooter fontSize={["14px","16px"]} flexDirection="column" padding={["0 10px","10px 20px"]} >
                  <HStack justifyContent="space-between">
                    <Text>{formatCash(drug.price)}</Text>
                    <HStack >
                      <Cart mb="4px" />
                      <Text marginInlineStart="0 !important">{formatQuantity(drug.marketPool.quantity)}</Text>
                    </HStack>
                  </HStack>
                  <BuySellMobileToggle
                    canSell={canSell}
                    canBuy={canBuy}
                    drugSlug={drugInfo.slug}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </SimpleGrid>
        <Box minH="60px"/>
      </VStack>
      <Footer>
        <Button
          w={["full", "auto"]}
          onClick={() => {
            if (playerEntity.turnsRemaining === 0) {
              router.push(`/${gameId}/end`);
              return;
            }

            router.push(`/${gameId}/travel`);
          }}
        >
          {playerEntity.turnsRemaining === 0 ? "End Game" : "Continue"}
        </Button>
      </Footer>
    </Layout>
  );
}

const BuySellBtns = ({
  canBuy,
  canSell,
  drugSlug,
}: {
  canBuy: boolean;
  canSell: boolean;
  drugSlug: string;
}) => {
  const router = useRouter();
  return (
    <HStack mb="10px" w="full">
      <Button
        flex="1"
        onClick={() => router.push(`${router.asPath}/${drugSlug}/buy`)}
        isDisabled={!canBuy}
      >
        Buy
      </Button>
      <Button
        flex="1"
        onClick={() => router.push(`${router.asPath}/${drugSlug}/sell`)}
        isDisabled={!canSell}
      >
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
      <Box
        boxSize="full"
        position="absolute"
        top="0"
        left="0"
        onClick={onToggle}
        pointerEvents={["auto", "none"]}
      />
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
