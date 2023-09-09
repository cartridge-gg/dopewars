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

  const prefixTitle =
    playerEntity.turnsRemaining === 0
      ? "Final Day"
      : `Day ${gameEntity.maxTurns - playerEntity.turnsRemaining + 1} / ${
          gameEntity.maxTurns + 1
        }`;

  return (
    <Layout
      leftPanelProps={{
        title: shortString.decodeShortString(locationEntity.id),
        prefixTitle: prefixTitle,
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
        <SimpleGrid columns={2} w="full" gap="12px" fontSize="20px">
          {locationEntity.drugMarkets.map((drug, index) => {
            const drugInfo = getDrugById(drug.id);
            return (
              <Card
                h="160px"
                key={index}
                cursor="pointer"
                onClick={() => {
                  playSound(Sounds.HoverClick, 0.3, false);
                  router.push(`${router.asPath}/${drugInfo.slug}`);
                }}
              >
                <CardHeader
                  textTransform="uppercase"
                  fontSize="20px"
                  textAlign="left"
                >
                  {drugInfo.name}
                </CardHeader>
                <CardBody>
                  <HStack w="full" justify="center">
                    <Box>{drugInfo.icon({})}</Box>
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
        <Box minH="40px" />
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
