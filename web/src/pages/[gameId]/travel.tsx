import { Button } from "@/components/common";
import { Arrow, BorderImage } from "@/components/icons";
import { Footer, Layout } from "@/components/layout";
import { Map as MapSvg } from "@/components/map";
import { Inventory, WantedIndicator } from "@/components/player";
import { ChildrenOrConnect } from "@/components/wallet";
import { GameClass } from "@/dojo/class/Game";
import { useConfigStore, useRouterContext, useSystems } from "@/dojo/hooks";
import { useGameStore } from "@/dojo/hooks/useGameStore";
import colors from "@/theme/colors";
import { IsMobile, formatCash, generatePixelBorderPath } from "@/utils/ui";
import { Box, Card, Grid, GridItem, HStack, Text, VStack, useDisclosure, useEventListener } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";

interface MarketPriceInfo {
  drug: string;
  price: number;
  diff?: number;
  percentage?: number;
}

const Travel = observer(() => {
  const { router, gameId } = useRouterContext();
  const { game, gameConfig, gameEvents } = useGameStore();
  const { travel, isPending } = useSystems();
  const configStore = useConfigStore();
  const { config } = configStore;

  const [targetLocation, setTargetLocation] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<string>();

  const isMobile = IsMobile();

  const locationName = useMemo(() => {
    if (targetLocation) {
      return configStore.getLocation(targetLocation)?.name;
    }
  }, [targetLocation, configStore]);

  useEffect(() => {
    if (game && !isPending) {
      if (game.player.location) {
        setCurrentLocation(game.player.location.location);
        setTargetLocation(game.player.location.location);
      } else {
        setTargetLocation("Queens");
      }
    }
  }, [game, isPending]);

  const prices = useMemo(() => {
    if (game && game.markets && game.markets.marketsByLocation && targetLocation) {
      const current = game.markets.marketsByLocation.get(currentLocation || "")!;
      const target = game.markets.marketsByLocation.get(targetLocation)!;

      return target.map((drug, index) => {
        if (currentLocation) {
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
  }, [game, targetLocation, currentLocation]);

  useEventListener("keydown", (e) => {
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
    if (!config) return;

    const idx = config.location.findIndex((location) => location.location === targetLocation)!;
    if (idx < config.location!.length - 1) {
      setTargetLocation(config.location[idx + 1].location);
    } else {
      setTargetLocation(config.location[0].location);
    }
  }, [targetLocation, config]);

  const onBack = useCallback(() => {
    if (!config) return;

    const idx = config.location.findIndex((location) => location.location === targetLocation)!;
    if (idx > 0) {
      setTargetLocation(config.location[idx - 1].location);
    } else {
      setTargetLocation(config.location[config.location.length - 1].location);
    }
  }, [targetLocation, config]);

  const onContinue = useCallback(async () => {
    if (targetLocation && game) {
      try {
        const locationId = configStore.getLocation(targetLocation).location_id;
        const { hash } = await travel(gameId!, locationId, game.getPendingCalls());
      } catch (e) {
        game.clearPendingCalls();
        console.log(e);
      }
    }
  }, [targetLocation, gameId, travel, game, configStore]);

  if (!game) return <></>;

  return (
    <Layout
      leftPanelProps={{
        title: "Destination",
        prefixTitle: "Select Your",
        map: (
          <MapSvg
            targetId={configStore.getLocation(targetLocation)?.location_id || 0}
            current={configStore.getLocation(currentLocation || "")?.location_id || 0}
            onSelect={(selectedId) => {
              setTargetLocation(configStore.getLocationById(selectedId)?.location);
            }}
          />
        ),
      }}
      footer={
        <Footer>
          <ChildrenOrConnect>
            {game.player.turn > 0 && (
              <Button isDisabled={isPending} w={["full", "auto"]} px={["auto", "20px"]} onClick={() => router.back()}>
                Back
              </Button>
            )}
            <Button
              w={["full", "auto"]}
              px={["auto", "20px"]}
              isDisabled={!targetLocation || targetLocation === currentLocation}
              isLoading={isPending}
              onClick={onContinue}
            >
              Travel
            </Button>
          </ChildrenOrConnect>
        </Footer>
      }
    >
      {/* Desktop  */}
      <VStack w="full" my="auto" display={["none", "flex"]} gap="20px" overflow={"visible"}>
        <VStack w="full" align="flex-start">
          <Inventory hidePawnshop />
          <HStack w="full" justify="space-between" pt={["0px", "20px"]}>
            <Text textStyle="subheading" fontSize="11px" color="neon.500">
              Location
            </Text>
            {targetLocation && (
              <WantedIndicator
                wantedTick={game.wanted.getWantedTick(configStore.getLocation(targetLocation).location_id)}
                highLimit={gameConfig?.max_wanted_shopping}
              />
            )}
          </HStack>
          <LocationSelectBar name={locationName} onNext={onNext} onBack={onBack} />
        </VStack>
        <LocationPrices game={game} prices={prices} isCurrentLocation={targetLocation == currentLocation} />
      </VStack>
      {/* Mobile  */}
      <VStack
        display={["flex", "none"]}
        w="full"
        h="auto"
        p="50px 16px 86px 16px"
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
        {isMobile && targetLocation && (
          <Box position="absolute" top="20px" left="16px">
            <WantedIndicator
              wantedTick={game.wanted.getWantedTick(configStore.getLocation(targetLocation).location_id)}
              highLimit={gameConfig?.max_wanted_shopping}
            />
          </Box>
        )}

        <Inventory hidePawnshop />
        <LocationSelectBar name={locationName} onNext={onNext} onBack={onBack} />
        <LocationPrices
          game={game}
          prices={prices}
          isCurrentLocation={currentLocation ? targetLocation === currentLocation : true}
        />
      </VStack>
    </Layout>
  );
});

export default Travel;

const LocationPrices = ({
  game,
  prices,
  isCurrentLocation,
}: {
  game: GameClass;
  prices: MarketPriceInfo[];
  isCurrentLocation?: boolean;
}) => {
  const { isOpen: isPercentage, onToggle: togglePercentage } = useDisclosure();
  const configStore = useConfigStore();

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
          "border-image-source": `url("data:image/svg+xml,${BorderImage({
            color: colors.neon["700"].toString(),
          })}")`,
        }}
      >
        <Grid templateColumns="repeat(2, 1fr)" position="relative">
          <Box position="absolute" boxSize="full" border="2px" borderColor="neon.900" />
          {prices.map((drug, index) => {
            const drugConfig = configStore.getDrug(game.seasonSettings.drugs_mode, drug.drug)!;
            return (
              <GridItem key={index} colSpan={1} border="1px" p="6px" borderColor="neon.600">
                <HStack gap="8px">
                  {drugConfig.icon({
                    boxSize: "24px",
                  })}
                  <Text display={isCurrentLocation ? "block" : ["none", "block"]}>${drug.price.toFixed(0)}</Text>

                  {drug.percentage && drug.diff && drug.diff !== 0 && (
                    <Text opacity="0.5" color={drug.diff >= 0 ? "neon.200" : "red"}>
                      (
                      {!isPercentage || isCurrentLocation === undefined
                        ? `${(drug.percentage || 0).toFixed(0)}%`
                        : formatCash(drug.diff)}
                      )
                    </Text>
                  )}
                  {!(drug.percentage && drug.diff && drug.diff !== 0) && !isCurrentLocation && (
                    <Text opacity="0.2"> (0%) </Text>
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
