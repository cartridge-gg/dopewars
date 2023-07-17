import { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Spacer,
  Divider,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  SimpleGrid,
} from "@chakra-ui/react";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Footer } from "@/components/Footer";
import {
  getDrugByName,
  getLocationByName,
  getLocationBySlug,
} from "@/hooks/ui";
import { Cart } from "@/components/icons";
import { Sounds, playSound } from "@/hooks/sound";
import { useLocationEntity } from "@/hooks/dojo/entities/useLocationEntity";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import { formatQuantity, formatCash } from "@/utils/ui";
import { Inventory } from "@/components/Inventory";
import { useGameEntity } from "@/hooks/dojo/entities/useGameEntity";

export default function Location() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const locationName = getLocationBySlug(
    router.query.locationSlug as string,
  ).name;

  const { location: locationEntity } = useLocationEntity({
    gameId,
    locationName,
  });
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: process.env.NEXT_PUBLIC_PLAYER_ADDRESS!,
  });
  const { game: gameEntity } = useGameEntity({
    gameId,
  });

  useEffect(() => {
    if (playerEntity && locationName) {
      // check if player at right location
      if (locationName !== playerEntity.location_name) {
        router.replace(
          `/${gameId}/${getLocationByName(playerEntity.location_name).slug}`,
        );
        return;
      }

      // check if game over
      if (playerEntity.turnsRemaining <= 0) {
        router.push(`/${gameId}/end`);
        return;
      }
    }
  }, [locationName, playerEntity, router, gameId]);

  if (!playerEntity || !locationEntity || !gameEntity) {
    return <></>;
  }

  const gap = "14px";

  return (
    <Layout
      title={locationEntity.name}
      prefixTitle={`Day ${
        gameEntity.maxTurns - playerEntity.turnsRemaining + 1
      } / ${gameEntity.maxTurns}`}
      imageSrc={`/images/locations/${
        getLocationByName(locationEntity.name).slug
      }.png`}
    >
      <Inventory gap={gap} />
      <VStack w="full" align="flex-start" gap={gap}>
        <Text textStyle="subheading" fontSize="10px" color="neon.500">
          Market
        </Text>
        <SimpleGrid columns={2} w="full" gap="18px" fontSize="20px">
          {locationEntity.drugMarkets.map((drug, index) => {
            const playerQuantity =
              playerEntity.drugs.find((d) => d.name === drug.name)?.quantity ||
              0;

            return (
              <Card
                h="180px"
                key={index}
                cursor="pointer"
                onClick={() => {
                  playSound(Sounds.HoverClick, 0.3, false);
                  router.push(
                    `${router.asPath}/${getDrugByName(drug.name).slug}`,
                  );
                }}
              >
                <CardHeader
                  textTransform="uppercase"
                  fontSize="20px"
                  textAlign="left"
                >
                  {drug.name}
                </CardHeader>
                <CardBody>
                  <HStack w="full" justify="center">
                    <Box>{getDrugByName(drug.name).icon({})}</Box>
                  </HStack>
                </CardBody>
                <CardFooter fontSize="16px">
                  <Text>{formatCash(drug.price)}</Text>
                  <Spacer />
                  <HStack>
                    <Cart />
                    <Text>{formatQuantity(drug.marketPool.quantity)}</Text>
                  </HStack>
                </CardFooter>
              </Card>
            );
          })}
        </SimpleGrid>
      </VStack>
      <Footer>
        <Button
          w={["full", "auto"]}
          onClick={() => {
            router.push(`/${gameId}/travel`);
          }}
        >
          Continue
        </Button>
      </Footer>
    </Layout>
  );
}
