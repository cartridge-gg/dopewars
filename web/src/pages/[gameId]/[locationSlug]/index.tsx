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
import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
import {
  getDrugByName,
  getLocationByName,
  getLocationBySlug,
} from "@/hooks/ui";
import { Bag } from "@/components/icons";
import { Sounds, playSound } from "@/hooks/sound";
import { useLocationEntity } from "@/hooks/dojo/entities/useLocationEntity";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import { formatQuantity, formatCash } from "@/utils/ui";

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
        // TODO: forward to game over
        console.log("game over");
        return;
      }
    }
  }, [locationName, playerEntity, router, gameId]);

  return (
    locationEntity &&
    playerEntity && (
      <Layout
        title={locationEntity.name}
        prefixTitle={`Day 1`}
        headerImage={`/images/locations/${
          getLocationByName(locationEntity.name).slug
        }.png`}
      >
        <Content>
          <SimpleGrid columns={2} w="full" gap="18px" fontSize="20px">
            {locationEntity.drugMarkets.map((drug, index) => {
              const playerQuantity =
                playerEntity.drugs.find((d) => d.name === drug.name)
                  ?.quantity || 0;

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
                    <HStack
                      color={playerQuantity > 0 ? "yellow.400" : "neon.500"}
                    >
                      <Bag />
                      <Text>{formatQuantity(playerQuantity)}</Text>
                    </HStack>
                  </CardFooter>
                </Card>
              );
            })}
          </SimpleGrid>
        </Content>
        <Footer>
          <Button
            w={["full", "auto"]}
            onClick={() => {
              router.push(`/${gameId}/turn`);
            }}
          >
            Continue
          </Button>
        </Footer>
      </Layout>
    )
  );
}
