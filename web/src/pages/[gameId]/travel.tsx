import { Arrow, Car, Event } from "@/components/icons";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import {
  Box,
  HStack,
  VStack,
  Text,
  Divider,
  useEventListener,
  Card,
  Grid,
  GridItem,
  Spacer,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatCash, generatePixelBorderPath } from "@/utils/ui";
import { Map } from "@/components/map";
import { motion } from "framer-motion";
import { useSystems } from "@/dojo/systems/useSystems";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { useToast } from "@/hooks/toast";
import { useDojo } from "@/dojo";
import {
  getDrugById,
  getLocationById,
  getLocationByType,
  locations,
  sortDrugMarkets,
} from "@/dojo/helpers";
import { LocationInfo } from "@/dojo/types";
import { useMarketPrices } from "@/dojo/components/useMarkets";

export default function Travel() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const [targetId, setTargetId] = useState<string>("");
  const [currentLocationId, setCurrentLocationId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen: isPercentage, onToggle: togglePercentage } = useDisclosure();

  const { toast } = useToast();
  const { account } = useDojo();
  const { travel, error: txError } = useSystems();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  const { locationPrices } = useMarketPrices({
    gameId,
  });

  useEffect(() => {
    if (playerEntity && !isSubmitting) {
      setCurrentLocationId(playerEntity.locationId);
      setTargetId(playerEntity.locationId);
    }
  }, [playerEntity, isSubmitting]);

  const targetMarkets = useMemo(() => {
    if (locationPrices) {
      const currentMarkets = sortDrugMarkets(
        locationPrices.get(currentLocationId),
      );
      const targetMarkets = sortDrugMarkets(locationPrices.get(targetId));

      return targetMarkets.map((drug, index) => {
        const diff = drug.price - currentMarkets[index].price;
        const percentage =
          (Math.abs(drug.price - currentMarkets[index].price) /
            currentMarkets[index].price) *
          100;

        return {
          id: drug.id,
          price: drug.price,
          diff,
          percentage,
        };
      });
    }

    return [];
  }, [locationPrices, targetId, currentLocationId]);

  useEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        back();
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next();
        break;
    }
  });

  const next = useCallback(() => {
    const idx = locations.findIndex((location) => location.id === targetId);
    if (idx < locations.length - 1) {
      setTargetId(locations[idx + 1].id);
    } else {
      setTargetId(locations[0].id);
    }
  }, [targetId]);

  const back = useCallback(() => {
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
      const { event, hash } = await travel(gameId, targetId);
      if (event) {
        return router.push(`/${gameId}/event/decision?nextId=${targetId}`);
      }

      toast(
        `You've traveled to ${getLocationById(targetId)?.name}`,
        Car,
        `http://amazing_explorer/${hash}`,
      );
      router.push(`/${gameId}/turn`);
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
      showBack
    >
      <VStack w="full" my="auto" display={["none", "flex"]} gap="0">
        {/* <Car boxSize="60px" />
        {locations.map((location, index) => (
          <Location
            {...location}
            key={index}
            name={location.name}
            isCurrent={location.id === currentLocationId}
            selected={location.id === targetId}
            onClick={() => setTargetId(location.id)}
          />
        ))}
        <Spacer /> */}
        <HStack w="full" justify="space-between" color="neon.500">
          <Text textStyle="subheading" fontSize="11px">
            {getLocationById(targetId)?.name} Prices
          </Text>
          <Text
            cursor="pointer"
            onClick={() => {
              togglePercentage();
            }}
            fontSize="18px"
            userSelect="none"
            visibility={targetId == currentLocationId ? "hidden" : "visible"}
          >
            ({isPercentage ? "#" : "%"})
          </Text>
        </HStack>
        <VStack w="full">
          <Card w="full" p="5px">
            <Grid templateColumns="repeat(2, 1fr)" position="relative">
              <Box
                position="absolute"
                boxSize="full"
                border="2px"
                borderColor="neon.900"
              />
              {targetMarkets.map((drug, index) => {
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
                      <Text>${drug.price.toFixed(0)}</Text>
                      {drug.diff !== 0 && (
                        <Text
                          opacity="0.5"
                          color={drug.diff >= 0 ? "neon.200" : "red"}
                        >
                          (
                          {isPercentage
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
        <Spacer minH="100px" />
        <Button
          w={["full", "250px"]}
          isDisabled={!targetId || targetId === currentLocationId}
          isLoading={isSubmitting && !txError}
          onClick={onContinue}
        >
          {targetId === currentLocationId
            ? "Current Location"
            : `Travel to ${getLocationById(targetId)?.name}`}
        </Button>
      </VStack>
      <VStack
        display={["flex", "none"]}
        w="full"
        h="160px"
        p="24px"
        position="fixed"
        bottom="0"
        right="0"
        spacing="0"
        pointerEvents="none"
        justify="flex-end"
        background="linear-gradient(transparent, #172217)"
        gap="14px"
      >
        <HStack w="full" pointerEvents="all">
          <Arrow
            style="outline"
            direction="left"
            boxSize="48px"
            userSelect="none"
            cursor="pointer"
            onClick={back}
          />
          <HStack
            p={2}
            bg="neon.700"
            clipPath={`polygon(${generatePixelBorderPath()})`}
            w="full"
            justify="center"
          >
            <Text>{getLocationById(targetId)?.name}</Text>
          </HStack>
          <Arrow
            style="outline"
            direction="right"
            boxSize="48px"
            userSelect="none"
            cursor="pointer"
            onClick={next}
          />
        </HStack>
        <Button
          w={["full", "auto"]}
          pointerEvents="all"
          isDisabled={!targetId || targetId === currentLocationId}
          isLoading={isSubmitting && !txError}
          onClick={onContinue}
        >
          {targetId === currentLocationId
            ? "Current Location"
            : `Travel to ${getLocationById(targetId)?.name}`}
        </Button>
      </VStack>
    </Layout>
  );
}

const Location = ({
  name,
  icon,
  selected,
  isCurrent,
  onClick,
}: {
  name: string;
  icon: React.FC;
  selected: boolean;
  isCurrent: boolean;
  onClick: () => void;
} & LocationInfo) => {
  const currentColor = isCurrent ? "yellow.400" : "neon.400";
  return (
    <HStack w="full">
      <Box
        as={motion.div}
        layout
        animate={{
          x: [5, 0, 5],
          transition: {
            duration: 0.5,
            repeat: Infinity,
          },
        }}
      >
        <Arrow
          style="pixel"
          direction="right"
          size="lg"
          color={currentColor}
          visibility={selected ? "visible" : "hidden"}
        />
      </Box>
      <HStack
        layerStyle={selected ? "rounded" : ""}
        py="12px"
        px="20px"
        w="full"
        cursor="pointer"
        onClick={onClick}
        position="relative"
        clipPath={`polygon(${generatePixelBorderPath()})`}
      >
        <HStack w="full" color={currentColor}>
          <HStack>
            {icon({})}
            <Text whiteSpace="nowrap">{name}</Text>
          </HStack>
          <Divider borderStyle="dotted" borderColor="neon.600" />
          <Text whiteSpace="nowrap">
            {isCurrent ? "You are here" : "1 Day"}
          </Text>
        </HStack>
      </HStack>
      <Box
        as={motion.div}
        layout
        animate={{
          x: [-5, 0, -5],
          transition: {
            duration: 0.5,
            repeat: Infinity,
          },
        }}
      >
        <Arrow
          style="pixel"
          direction="left"
          size="lg"
          color={currentColor}
          visibility={selected ? "visible" : "hidden"}
        />
      </Box>
    </HStack>
  );
};
