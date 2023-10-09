import { Arrow, Car, Siren, Truck } from "@/components/icons";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import {
  Box,
  HStack,
  VStack,
  Text,
  useEventListener,
  Card,
  Grid,
  GridItem,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import {
  getDrugById,
  getDrugByType,
  getLocationById,
  getLocationByType,
  locations,
  sortDrugMarkets,
} from "@/dojo/helpers";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatCash, generatePixelBorderPath } from "@/utils/ui";
import { Map } from "@/components/map";

import { useToast } from "@/hooks/toast";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { Location } from "@/dojo/types";
import { MarketEventData } from "@/dojo/events";
// import { useEntityQuery, useComponentValue } from "@latticexyz/react";
// import { Has } from "@latticexyz/recs";
// import { num, ec } from "starknet";

import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useSystems } from "@/dojo/hooks/useSystems";
import { usePlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { useMarketPrices } from "@/dojo/queries/useMarkets";

interface MarketPriceInfo {
  id: string;
  price: number;
  diff?: number;
  percentage?: number;
}

export default function Travel() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const [targetId, setTargetId] = useState<string>();
  const [currentLocationId, setCurrentLocationId] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { account } = useDojoContext();
  const { travel } = useSystems();

  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
 
  const { locationPrices } = useMarketPrices({
    gameId,
  });

  const locationName = useMemo(() => {
    if (targetId) {
      return getLocationById(targetId)?.name;
    }
  }, [targetId]);

  useEffect(() => {
    if (playerEntity && !isSubmitting) {
      if (playerEntity.locationId) {
        setCurrentLocationId(playerEntity.locationId);
        setTargetId(playerEntity.locationId);
      } else {
        setTargetId(getLocationByType(Location.Central)?.id);
      }
    }
  }, [playerEntity, isSubmitting]);

  const prices = useMemo(() => {
    if (locationPrices && targetId) {
      const current = sortDrugMarkets(
        locationPrices.get(currentLocationId || ""),
      );

      const target = sortDrugMarkets(locationPrices.get(targetId));
      return target.map((drug, index) => {
        if (currentLocationId) {
          const diff = drug.price - current[index].price;
          const percentage =
            (Math.abs(drug.price - current[index].price) /
              current[index].price) *
            100;

          return {
            id: drug.id,
            price: drug.price,
            diff,
            percentage,
          } as MarketPriceInfo;
        }

        return {
          id: drug.id,
          price: drug.price,
        } as MarketPriceInfo;
      });
    }

    return [];
  }, [locationPrices, targetId, currentLocationId]);

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
    if (targetId) {
      setIsSubmitting(true);
      const locationId = getLocationById(targetId)?.type;
      const { event, events, hash } = await travel( gameId, locationId);
      if (event) {
        return router.push(`/${gameId}/event/decision?nextId=${targetId}`);
      }

      toast(
        `You've traveled to ${locationName}`,
        Car,
        `http://amazing_explorer/${hash}`,
      );
      router.push(`/${gameId}/turn`);

      // market events
      if (events) {
        for (let event of events) {
          const e = event as MarketEventData;
          const msg = e.increase
            ? `Pigs seized ${getDrugByType(Number(e.drugId))?.name} in ${
              getLocationByType(Number(e.locationId))?.name
              }`
            : `A shipment of ${getDrugByType(Number(e.drugId))?.name} has arrived to ${
              getLocationByType(Number(e.locationId))?.name
              }`;
          const icon = e.increase ? Siren : Truck;
          toast(msg, icon, `http://amazing_explorer/${hash}`, 6000);
        }
      }
    }
  }, [targetId, router, gameId, travel, toast]);

  
  if (!playerEntity || !locationPrices) return <></>;

  return (
    <Layout
      leftPanelProps={{
        title: "Destination",
        prefixTitle: "Select Your",
        map: (
          <Map
            target={getLocationById(targetId)?.type}
            current={getLocationById(currentLocationId)?.type}
            onSelect={(selected) => {
              setTargetId(getLocationByType(selected)!.id);
            }}
          />
        ),
      }}
    >
      <VStack w="full" my="auto" display={["none", "flex"]} gap="20px">
        <VStack w="full" align="flex-start">
          <Text textStyle="subheading" fontSize="11px" color="neon.500">
            Location
          </Text>
          <LocationSelectBar
            name={locationName}
            onNext={onNext}
            onBack={onBack}
          />
        </VStack>
        <LocationPrices prices={prices} />
        <Spacer minH="100px" />
        <HStack w={["auto !important", "full"]} pointerEvents="all">
          <Button
            isDisabled={isSubmitting}
            w="full"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button
            w="full"
            isDisabled={!targetId || targetId === currentLocationId}
            isLoading={isSubmitting /*&& !txError*/}
            onClick={onContinue}
          >
            Travel
          </Button>
        </HStack>
      </VStack>
      <VStack
        display={["flex", "none"]}
        w="full"
        h="auto"
        p="24px"
        position="fixed"
        bottom="0"
        right="0"
        spacing="0"
        pointerEvents="none"
        justify="flex-end"
        background="linear-gradient(transparent, 20%, #172217, 50%, #172217)"
        gap="14px"
      >
        <LocationSelectBar
          name={locationName}
          onNext={onNext}
          onBack={onBack}
        />
        <LocationPrices
          prices={prices}
          isCurrentLocation={
            currentLocationId ? targetId === currentLocationId : true
          }
        />
        <HStack w="full" pointerEvents="all">
          <Button
            isDisabled={isSubmitting}
            w="full"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button
            w={["full", "auto"]}
            isDisabled={!targetId || targetId === currentLocationId}
            isLoading={isSubmitting /*&& !txError*/}
            onClick={onContinue}
          >
            Travel
          </Button>
        </HStack>
      </VStack>
    </Layout>
  );
}

const LocationPrices = ({
  prices,
  isCurrentLocation,
}: {
  prices: MarketPriceInfo[];
  isCurrentLocation?: boolean;
}) => {
  const { isOpen: isPercentage, onToggle: togglePercentage } = useDisclosure();

  return (
    <VStack w="full">
      <HStack
        w="full"
        justify="space-between"
        color="neon.500"
        display={["none", "flex"]}
      >
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
      <Card w="full" p="5px" pointerEvents="all">
        <Grid templateColumns="repeat(2, 1fr)" position="relative">
          <Box
            position="absolute"
            boxSize="full"
            border="2px"
            borderColor="neon.900"
          />
          {prices.map((drug, index) => {
            return (
              <GridItem
                key={index}
                colSpan={1}
                border="1px"
                p="6px"
                borderColor="neon.600"
              >
                <HStack gap="8px">
                  {getDrugById(drug.id)?.icon({
                    boxSize: "24px",
                  })}
                  <Text
                    display={isCurrentLocation ? "block" : ["none", "block"]}
                  >
                    ${drug.price.toFixed(0)}
                  </Text>
                  {drug.percentage && drug.diff && drug.diff !== 0 && (
                    <Text
                      opacity="0.5"
                      color={drug.diff >= 0 ? "neon.200" : "red"}
                    >
                      (
                      {!isPercentage
                        ? `${drug.percentage.toFixed(0)}%`
                        : formatCash(drug.diff)}
                      )
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

const LocationSelectBar = ({
  name,
  onNext,
  onBack,
}: {
  name?: string;
  onNext: () => void;
  onBack: () => void;
}) => {
  return (
    <HStack w="full" pointerEvents="all">
      <Arrow
        style="outline"
        direction="left"
        boxSize="48px"
        userSelect="none"
        cursor="pointer"
        onClick={onBack}
      />
      <HStack
        p={2}
        bg="neon.700"
        clipPath={`polygon(${generatePixelBorderPath()})`}
        w="full"
        justify="center"
      >
        <Text>{name}</Text>
      </HStack>
      <Arrow
        style="outline"
        direction="right"
        boxSize="48px"
        userSelect="none"
        cursor="pointer"
        onClick={onNext}
      />
    </HStack>
  );
};
