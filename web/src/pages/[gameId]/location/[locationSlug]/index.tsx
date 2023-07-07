import { ReactNode, useEffect, useState } from "react";
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
  Ludes,
  Weed,
  Acid,
  Speed,
  Heroin,
  Cocaine,
} from "@/components/icons/drugs";
import { Inventory } from "@/components/Inventory";
import { LocationProps, useUiStore } from "@/hooks/ui";
import {
  useGameStore,
  travelTo,
  endTurn,
  travelAndEndTurn,
} from "@/hooks/state";
import { Bag } from "@/components/icons";
import { Sounds, playSound } from "@/hooks/sound";

export default function Location() {
  const router = useRouter();

  const { locations, drugs } = useUiStore.getState();
  const [location, setLocation] = useState<LocationProps | undefined>();

  const inventory = useGameStore((state) => state.inventory);
  const locationMenu = useGameStore((state) => state.menu);
  const turns = useGameStore((state) => state.turns);

  useEffect(() => {
    if (!locationMenu) {
      location && travelTo(location.name);
    }
  }, [location, locationMenu]);

  useEffect(() => {
    const { getLocationBySlug } = useUiStore.getState();
    const locationSlug = router.query.locationSlug?.toString() || "";
    const location = getLocationBySlug(locationSlug);
    setLocation(location);
  }, [router.query]);

  return (
    location &&
    locationMenu && (
      <Layout
        title={location?.name}
        prefixTitle={`Day ${turns.current}`}
        headerImage={`/images/locations/${location?.slug}.png`}
      >
        <Content>
          {/* <Inventory pb="20px" /> */}
          <SimpleGrid columns={2} w="full" gap="18px" fontSize="20px">
            {drugs.map((drug, index) => (
              <Card
                h="180px"
                key={index}
                cursor="pointer"
                onClick={() => {
                  playSound(Sounds.HoverClick, 0.3, false);
                  router.push(`${router.asPath}/${drug.slug}`);
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
                    <Box>{drug.icon({})}</Box>
                  </HStack>
                </CardBody>
                <CardFooter fontSize="16px">
                  <Text>${locationMenu[drug.name].price}</Text>
                  <Spacer />
                  <HStack
                    color={
                      inventory.drugs[drug.name].quantity > 0
                        ? "yellow.400"
                        : "neon.500"
                    }
                  >
                    <Bag />
                    <Text>{inventory.drugs[drug.name].quantity}</Text>
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
              travelAndEndTurn();
              router.push("/0x1234/turn");
            }}
          >
            Travel and end turn
          </Button>
        </Footer>
      </Layout>
    )
  );
}
