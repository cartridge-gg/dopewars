import Button from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Inventory } from "@/components/Inventory";
import Layout from "@/components/Layout";
import { Arrow } from "@/components/icons";
import BorderImage from "@/components/icons/BorderImage";
import { Map as MapSvg } from "@/components/map";
import { AdverseEventData, MarketEventData, displayMarketEvents } from "@/dojo/events";
import { WorldEvents } from "@/dojo/generated/contractEvents";
import {
  locations
} from "@/dojo/helpers";
import { useConfigStore, useDojoContext, useRouterContext, useSystems } from "@/dojo/hooks";
import { useGameStore } from "@/dojo/hooks/useGameStore";
import { useToast } from "@/hooks/toast";
import colors from "@/theme/colors";
import { formatCash, generatePixelBorderPath } from "@/utils/ui";
import {
  Box,
  Card,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
  useDisclosure,
  useEventListener
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface MarketPriceInfo {
  drug: string;
  price: number;
  diff?: number;
  percentage?: number;
}

export default function Travel() {
  const { router, gameId } = useRouterContext();

  const [targetId, setTargetId] = useState<string>();
  const [currentLocationId, setCurrentLocationId] = useState<string>();

  const toaster = useToast();
  const { travel, isPending } = useSystems();

  const { account } = useDojoContext();
  // const { playerEntity } = usePlayerStore();
  const { game } = useGameStore()
  const configStore = useConfigStore()

  const locationName = useMemo(() => {
    if (targetId) {
      return configStore.getLocation(targetId)?.name;
    }
  }, [targetId]);

  useEffect(() => {
    if (game && !isPending) {
      if (game.player.location) {
        setCurrentLocationId(game.player.location.location);
        setTargetId(game.player.location.location);
      } else {
        setTargetId("Queens");
      }
    }
  }, [game, isPending]);

  const prices = useMemo(() => {
    if (game && game.markets && game.markets.marketsByLocation && targetId) {
      const current = game.markets.marketsByLocation.get(currentLocationId || "");
      const target = game.markets.marketsByLocation.get(targetId);

      return target.map((drug, index) => {
        if (currentLocationId) {
          const diff = drug.price - current[index].price;
          const percentage = (Math.abs(drug.price - current[index].price) / current[index].price) * 100;

          return {
            drug: drug.drug,
            price: drug.price,
            diff,
            percentage,
          } as MarketPriceInfo;
        }

        return {
          drug: drug.drug,
          price: drug.price,
        } as MarketPriceInfo;
      });
    }

    return [];
  }, [game, targetId, currentLocationId]);

  useEventListener("keydown", (e) => {
    console.log(e.key);
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        onBack();
        break;
      case "ArrowLeft":
      case "ArrowDown":
        onNext();
        break;
      case "Enter":
        onContinue();
        break;
    }
  });

  const onNext = useCallback(() => {
    const idx = locations.findIndex((location) => location.id === targetId);
    if (idx < locations.length - 1) {
      setTargetId(locations[idx + 1].id);
    } else {
      setTargetId(locations[0].id);
    }
  }, [targetId]);

  const onBack = useCallback(() => {
    const idx = locations.findIndex((location) => location.id === targetId);
    if (idx > 0) {
      setTargetId(locations[idx - 1].id);
    } else {
      setTargetId(locations[locations.length - 1].id);
    }
  }, [targetId]);

  const onContinue = useCallback(async () => {
    if (targetId && game) {
      try {
        const locationId = configStore.getLocation(targetId).location_id
        const { event, events, hash, isGameOver } = await travel(gameId, locationId);

        if (isGameOver) {
          return router.replace(`/${gameId}/end`);
        }

        if (event) {
          if (event.eventType === WorldEvents.AdverseEvent) {
            const advEvent = event as AdverseEventData;
            return router.push(
              `/${gameId}/event/decision?healthLoss=${advEvent.healthLoss}&demandPct=${advEvent.demandPct}`,
            );
          }
          if (event.eventType === WorldEvents.AtPawnshop) {
            return router.push(`/${gameId}/pawnshop`);
          }
        }

        if (events) {
          displayMarketEvents(events as MarketEventData[], toaster);
        }

        // toaster.toast({
        //   message: `You've traveled to ${locationName}`,
        //   icon: Car,
        //   link: `http://amazing_explorer/${hash}`,
        // });

        router.push(`/${gameId}/${configStore.getLocation(targetId)!.location.toLowerCase()}`);
      } catch (e) {
        console.log(e);
      }
    }
  }, [targetId, router, gameId, travel, toaster, game]);

  if (!game) return <></>;

  return (
    <Layout
      leftPanelProps={{
        title: "Destination",
        prefixTitle: "Select Your",
        map: (
          <MapSvg
            target={targetId}
            current={currentLocationId}
            onSelect={(selected) => {
              setTargetId(selected);
            }}
          />
        ),
      }}
      footer={
        <Footer>
          {game.player.turn > 0 && (
            <Button isDisabled={isPending} w={["full", "auto"]} px={["auto", "20px"]} onClick={() => router.back()}>
              Back
            </Button>
          )}
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            isDisabled={!targetId || targetId === currentLocationId}
            isLoading={isPending /*&& !txError*/}
            onClick={onContinue}
          >
            Travel
          </Button>
        </Footer>
      }
    >
      <VStack w="full" my="auto" display={["none", "flex"]} gap="20px" overflow={"visible"}>
        <VStack w="full" align="flex-start">
          <Inventory />
          <Text textStyle="subheading" pt={["0px", "20px"]} fontSize="11px" color="neon.500">
            Location
          </Text>
          <LocationSelectBar name={locationName} onNext={onNext} onBack={onBack} />
        </VStack>
        <LocationPrices prices={prices} />
      </VStack>
      <VStack
        display={["flex", "none"]}
        w="full"
        h="auto"
        p="60px 16px 86px 16px"
        position="fixed"
        bottom="0"
        right="0"
        spacing="0"
        pointerEvents="none"
        justify="flex-end"
        background="linear-gradient(transparent, 10%, #172217, 25%, #172217)"
        gap="14px"
        overflow={"visible"}
      >
        <Inventory />
        <LocationSelectBar name={locationName} onNext={onNext} onBack={onBack} />
        <LocationPrices prices={prices} isCurrentLocation={currentLocationId ? targetId === currentLocationId : true} />
      </VStack>
    </Layout>
  );
}

const LocationPrices = ({ prices, isCurrentLocation }: { prices: MarketPriceInfo[]; isCurrentLocation?: boolean }) => {
  const { isOpen: isPercentage, onToggle: togglePercentage } = useDisclosure();
  const configStore = useConfigStore()

  return (
    <VStack w="full">
      <HStack w="full" justify="space-between" color="neon.500" display={["none", "flex"]}>
        <Text textStyle="subheading" fontSize="11px">
          Prices
        </Text>
        <Text
          cursor="pointer"
          onClick={() => {
            togglePercentage();
          }}
          fontSize="18px"
          userSelect="none"
          pointerEvents="all"
        >
          ({!isPercentage ? "#" : "%"})
        </Text>
      </HStack>
      <Card
        w="full"
        p="5px"
        pointerEvents="all"
        sx={{
          borderImageSource: `url("data:image/svg+xml,${BorderImage({
            color: colors.neon["700"].toString(),
          })}")`,
        }}
      >
        <Grid templateColumns="repeat(2, 1fr)" position="relative">
          <Box position="absolute" boxSize="full" border="2px" borderColor="neon.900" />
          {prices.map((drug, index) => {
            const drugConfig = configStore.getDrug(drug.drug)!;
            return (
              <GridItem key={index} colSpan={1} border="1px" p="6px" borderColor="neon.600">
                <HStack gap="8px">
                  {drugConfig.icon({
                    boxSize: "24px",
                  })}
                  <Text display={isCurrentLocation ? "block" : ["none", "block"]}>${drug.price.toFixed(0)}</Text>
                  {drug.percentage && drug.diff && drug.diff !== 0 && (
                    <Text opacity="0.5" color={drug.diff >= 0 ? "neon.200" : "red"}>
                      ({!isPercentage ? `${drug.percentage.toFixed(0)}%` : formatCash(drug.diff)})
                    </Text>
                  )}
                </HStack>
              </GridItem>
            );
          })}
        </Grid>
      </Card>
    </VStack>
  );
};

const LocationSelectBar = ({ name, onNext, onBack }: { name?: string; onNext: () => void; onBack: () => void }) => {
  return (
    <HStack w="full" pointerEvents="all">
      <Arrow style="outline" direction="left" boxSize="48px" userSelect="none" cursor="pointer" onClick={onBack} />
      <HStack p={2} bg="neon.700" clipPath={`polygon(${generatePixelBorderPath()})`} w="full" justify="center">
        <Text>{name}</Text>
      </HStack>
      <Arrow style="outline" direction="right" boxSize="48px" userSelect="none" cursor="pointer" onClick={onNext} />
    </HStack>
  );
};
