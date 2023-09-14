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
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { generatePixelBorderPath } from "@/utils/ui";
import { Map } from "@/components/map";
import { motion } from "framer-motion";
import { useSystems } from "@/dojo/systems/useSystems";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { useToast } from "@/hooks/toast";
import { useDojo } from "@/dojo";
import { getLocationById, getLocationByType, locations } from "@/dojo/helpers";
import { LocationInfo } from "@/dojo/types";

export default function Travel() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const [targetId, setTargetId] = useState<string>("");
  const [currentLocationId, setCurrentLocationId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { account } = useDojo();
  const { travel, error: txError } = useSystems();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  const targetLocation = useMemo(() => getLocationById(targetId), [targetId]);

  useEffect(() => {
    if (playerEntity && !isSubmitting) {
      const location = getLocationById(playerEntity.locationId);
      setCurrentLocationId(location.id);
      setTargetId(location.id);
    }
  }, [playerEntity, isSubmitting]);

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
      console.log(event, hash);
      if (event) {
        router.push(`/${gameId}/event/decision?nextId=${targetId}`);
      } else {
        toast(
          `You've traveled to ${targetLocation.name}`,
          Car,
          `http://amazing_explorer/${hash}`,
        );

        router.push(`/${gameId}/turn`);
      }
    }
  }, [targetId, router, gameId, targetLocation, travel, toast]);

  return (
    <Layout
      leftPanelProps={{
        title: "Destination",
        prefixTitle: "Select Your",
        map: (
          <Map
            highlight={targetLocation.type}
            onSelect={(selected) => {
              setTargetId(getLocationByType(selected).id);
            }}
          />
        ),
      }}
      showMap={true}
      showBack={true}
    >
      <VStack w="full" my="auto" display={["none", "flex"]}>
        <Car boxSize="60px" />
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
        <Spacer />
        <Button
          w={["full", "250px"]}
          isDisabled={!targetId || targetId === currentLocationId}
          isLoading={isSubmitting && !txError}
          onClick={onContinue}
        >
          {targetId === currentLocationId
            ? "Current Location"
            : `Travel to ${targetLocation.name}`}
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
            <Text>{targetLocation.name}</Text>
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
            : `Travel to ${targetLocation.name}`}
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
