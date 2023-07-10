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
  LocationProps,
  useUiStore,
} from "@/hooks/ui";
import { Bag } from "@/components/icons";
import { Sounds, playSound } from "@/hooks/sound";
import { useLocationEntity } from "@/hooks/dojo/entities/useLocationEntity";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";

export default function Location() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const slug = router.query.locationSlug as string;
  const locationName = getLocationBySlug(slug).name;

  const { location: locationEntity } = useLocationEntity({
    gameId,
    locationName,
  });
  const { player } = usePlayerEntity({
    gameId,
    address: process.env.NEXT_PUBLIC_PLAYER_ADDRESS!,
  });

  useEffect(() => {
    if (player && locationName) {
      // check player location and forward to correct location
      if (locationName !== player.location_name) {
        router.replace(
          `/${gameId}/${getLocationByName(player.location_name).slug}`,
        );
        return;
      }

      // check if game over
      if (player.turnsRemaining <= 0) {
        // TODO: forward to game over
        console.log("game over");
        return;
      }
    }
  }, [locationName, player, router]);

  return (
    locationEntity && (
      <Layout
        title={locationEntity.name}
        prefixTitle={`Day 1`}
        headerImage={`/images/locations/${
          getLocationByName(locationEntity.name).slug
        }.png`}
      >
        <Content>
          <SimpleGrid columns={2} w="full" gap="18px" fontSize="20px">
            {locationEntity.drugMarkets.map((drug, index) => (
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
                  <Text>${drug.price.toString()}</Text>
                  <Spacer />
                  <HStack color={false ? "yellow.400" : "neon.500"}>
                    <Bag />
                    <Text>{0}</Text>
                  </HStack>
                </CardFooter>
              </Card>
            ))}
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
