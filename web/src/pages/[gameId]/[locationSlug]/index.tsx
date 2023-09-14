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
  Button,
  StyleProps,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Cart } from "@/components/icons";
import { Footer } from "@/components/Footer";
import { Sounds, playSound } from "@/hooks/sound";
import { useLocationEntity } from "@/dojo/entities/useLocationEntity";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { formatQuantity, formatCash } from "@/utils/ui";
import { Inventory } from "@/components/Inventory";
import { useGameEntity } from "@/dojo/entities/useGameEntity";
import { useDojo } from "@/dojo";
import { shortString } from "starknet";
import {
  getDrugById,
  getLocationById,
  getLocationBySlug,
} from "@/dojo/helpers";
import { motion } from "framer-motion";

export default function Location() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const locationId = getLocationBySlug(router.query.locationSlug as string).id;
  const { account } = useDojo();

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
          `/${gameId}/${getLocationById(playerEntity.locationId).slug}`,
        );
        return;
      }
    }
  }, [locationId, playerEntity, router, gameId]);

  if (!playerEntity || !locationEntity || !gameEntity) {
    return <></>;
  }

  return (
    <Layout
      leftPanelProps={{
        title: shortString.decodeShortString(locationEntity.id),
        imageSrc: `/images/locations/${
          getLocationById(locationEntity.id).slug
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
        <SimpleGrid columns={[1, 2]} w="full" gap="20px" fontSize="20px">
          {locationEntity.drugMarkets.map((drug, index) => {
            const drugInfo = getDrugById(drug.id);
            const canBuy =
              drug.price <= playerEntity.cash &&
              playerEntity.drugCount < playerEntity.bagLimit;
            const canSell = !!playerEntity.drugs.find(
              (d) => d.id === drug.id && d.quantity > 0,
            );
            return (
              <Card h={["220px", "180px"]} key={index}>
                <CardHeader
                  textTransform="uppercase"
                  fontSize="20px"
                  textAlign="left"
                >
                  {drugInfo.name}
                </CardHeader>
                <CardBody>
                  <HStack w="full" justify="center" position="relative" m="2px">
                    <Box
                      w="full"
                      as={motion.div}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      position="absolute"
                      bgColor="neon.900"
                      pointerEvents={["none", "auto"]}
                    >
                      <BuySell
                        p="20px"
                        canSell={canSell}
                        canBuy={canBuy}
                        drugSlug={drugInfo.slug}
                      />
                    </Box>
                    {drugInfo.icon({})}
                  </HStack>
                </CardBody>
                <CardFooter fontSize="16px" flexDirection="column" gap="10px">
                  <HStack>
                    <Text>{formatCash(drug.price)}</Text>
                    <Spacer />
                    <HStack>
                      <Cart />
                      <Text>{formatQuantity(drug.marketPool.quantity)}</Text>
                    </HStack>
                  </HStack>
                  <BuySell
                    display={["flex", "none"]}
                    canSell={canSell}
                    canBuy={canBuy}
                    drugSlug={drugInfo.slug}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </SimpleGrid>
        <Box minH="60px" />
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

const BuySell = ({
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
  return (
    <HStack w="full" gap="10px" {...props}>
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
