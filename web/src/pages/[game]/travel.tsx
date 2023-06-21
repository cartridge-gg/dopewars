import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
import { Arrow, Car } from "@/components/icons";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import {
  Box,
  HStack,
  VStack,
  Text,
  Spacer,
  Divider,
  useEventListener,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useState } from "react";
import { IsMobile } from "@/utils/ui";
import { Map } from "@/components/map";
import { Locations, travelTo } from "@/hooks/state";
import { motion } from "framer-motion";
import { LocationProps, useUiStore } from "@/hooks/ui";

export default function Travel() {
  const router = useRouter();
  const [target, setTarget] = useState<Locations>(Locations.Central);
  const { locations } = useUiStore.getState();

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
  }, [target]);

  const back = useCallback(() => {
    const idx = locations.findIndex((location) => location.name === target);
    if (idx > 0) {
      setTarget(locations[idx - 1].name);
    } else {
      setTarget(locations[locations.length - 1].name);
    }
  }, [target]);

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
      <Content>
        {!IsMobile() && <Car boxSize="60px" />}
        <VStack w="full">
          {!IsMobile() &&
            locations.map((location, index) => (
              <Location
                {...location}
                key={index}
                selected={location.name === target}
                onClick={() => setTarget(location.name)}
              />
            ))}
        </VStack>
      </Content>
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
              <HStack layerStyle="rounded" w="full" justify="center">
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
            onClick={() => {
              travelTo(target);
              router.push(
                `/0x123/location/${
                  locations.find((i) => i.name === target).slug
                }`,
              );
            }}
          >{`Travel to ${target}`}</Button>
        </VStack>
      </Footer>
    </Layout>
  );
}

const Location = ({
  name,
  turn,
  icon,
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
} & LocationProps) => {
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
      >
        <HStack w="full">
          <HStack>
            {icon}
            <Text whiteSpace="nowrap">{name}</Text>
          </HStack>
          <Divider borderStyle="dotted" borderColor="neon.600" />
          <Text whiteSpace="nowrap">{turn} DAY</Text>
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
          visibility={selected ? "visible" : "hidden"}
        />
      </Box>
    </HStack>
  );
};
