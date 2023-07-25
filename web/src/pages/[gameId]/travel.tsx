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
  Spacer,
} from "@chakra-ui/react";
import { Locations, usePlayerState, TravelEvents } from "@/hooks/state";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { IsMobile, generatePixelBorderPath } from "@/utils/ui";
import { Map } from "@/components/map";
import { motion } from "framer-motion";
import {
  LocationProps,
  useUiStore,
  getLocationByName,
  getEventBySlug,
} from "@/hooks/ui";
import { useSystems } from "@/hooks/dojo/systems/useSystems";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import { RandomEventData } from "@/utils/event";
import { useToast } from "@/hooks/toast";
import { useDojo } from "@/hooks/dojo";

export default function Travel() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const [target, setTarget] = useState<Locations>();
  const [currentLocation, setCurrentLocation] = useState<Locations>();
  const { locations } = useUiStore.getState();
  const { addEvent } = usePlayerState();
  const { toast } = useToast();
  const { account } = useDojo();

  const { travel, isPending, error: txError } = useSystems();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  useEffect(() => {
    if (playerEntity) {
      const location = getLocationByName(playerEntity.location_name).name;
      setCurrentLocation(location);
      setTarget(location);
    }
  }, [playerEntity]);

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
    const idx = locations.findIndex((location) => location.name === target);
    if (idx < locations.length - 1) {
      setTarget(locations[idx + 1].name);
    } else {
      setTarget(locations[0].name);
    }
  }, [target, locations]);

  const back = useCallback(() => {
    const idx = locations.findIndex((location) => location.name === target);
    if (idx > 0) {
      setTarget(locations[idx - 1].name);
    } else {
      setTarget(locations[locations.length - 1].name);
    }
  }, [target, locations]);

  const onContinue = useCallback(async () => {
    if (target) {
      const { event, hash } = await travel(gameId, target);
      if (event) {
        const typeSlug = (event as RandomEventData).arrested
          ? "arrested"
          : "mugged";

        const travelEvent = getEventBySlug(typeSlug);
        addEvent(travelEvent.name);

        toast(
          `${travelEvent.description}`,
          Event,
          `http://amazing_explorer/${hash}`,
        );

        router.push(`/${gameId}/event/${typeSlug}`);
      } else {
        toast(
          `You've traveled to ${target}`,
          Car,
          `http://amazing_explorer/${hash}`,
        );

        router.push(`/${gameId}/turn`);
      }
    }
  }, [target, router, gameId, addEvent, travel, toast]);

  return (
    <Layout
      title="Destination"
      prefixTitle="Select Your"
      showBack={true}
      map={
        <Map
          highlight={target}
          onSelect={(selected) => {
            setTarget(selected);
          }}
        />
      }
    >
      <VStack w="full" my="auto" display={["none", "flex"]}>
        <Car boxSize="60px" />
        {locations.map((location, index) => (
          <Location
            {...location}
            key={index}
            name={location.name}
            isCurrent={location.name === currentLocation}
            selected={location.name === target}
            onClick={() => setTarget(location.name)}
          />
        ))}
        <Spacer />
        <Button
          w={["full", "250px"]}
          isDisabled={!target || target === currentLocation}
          isLoading={isPending && !txError}
          onClick={onContinue}
        >
          {target === currentLocation
            ? "Current Location"
            : `Travel to ${target}`}
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
            <Text>{target}</Text>
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
          isDisabled={!target || target === currentLocation}
          isLoading={isPending && !txError}
          onClick={onContinue}
        >
          {target === currentLocation
            ? "Current Location"
            : `Travel to ${target}`}
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
} & LocationProps) => {
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
