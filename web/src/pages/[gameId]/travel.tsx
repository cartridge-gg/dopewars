import { Footer } from "@/components/Footer";
import { Arrow, Car } from "@/components/icons";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import {
  Box,
  HStack,
  VStack,
  Text,
  Divider,
  useEventListener,
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
import { useRyoSystems } from "@/hooks/dojo/systems/useRyoSystems";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import { RandomEventData } from "@/utils/event";

export default function Travel() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const [target, setTarget] = useState<Locations>();
  const [currentLocation, setCurrentLocation] = useState<Locations>();
  const { locations } = useUiStore.getState();
  const { addEvent } = usePlayerState();

  const { travel, isPending, error: txError } = useRyoSystems();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: process.env.NEXT_PUBLIC_PLAYER_ADDRESS!,
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

  return (
    <Layout
      title="Destination"
      prefixTitle="Select Your"
      map={
        <Map
          highlight={target}
          onSelect={(selected) => {
            setTarget(selected);
          }}
        />
      }
    >
      <VStack w="full" pt="100px">
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
      </VStack>
      <Footer>
        <VStack w="full" align="flex-end">
          {IsMobile() && (
            <HStack
              position="absolute"
              top="40px"
              left="0"
              w="full"
              px="20px"
              justify="space-between"
              align="center"
              gap="20px"
            >
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
          )}
          <Button
            w={["full", "auto"]}
            isDisabled={!target || target === currentLocation}
            isLoading={isPending && !txError}
            onClick={async () => {
              if (target) {
                const eventData = await travel(gameId, target);
                if (eventData) {
                  const typeSlug = (eventData as RandomEventData).arrested
                    ? "arrested"
                    : "mugged";

                  const travelEvent = getEventBySlug(typeSlug);
                  addEvent(travelEvent.name);

                  router.push(`/${gameId}/event/${typeSlug}`);
                } else {
                  router.push(`/${gameId}/turn`);
                }
              }
            }}
          >
            {target === currentLocation
              ? "Current Location"
              : `Travel to ${target}`}
          </Button>
        </VStack>
      </Footer>
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
