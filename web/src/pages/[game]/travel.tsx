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
import {
  Brooklyn,
  CentralPark,
  ConeyIsland,
  Manhattan,
  Queens,
  StatenIsland,
} from "@/components/icons/locations";
import { IsMobile } from "@/utils/ui";
import { Map } from "@/components/map";
import { Locations } from "@/hooks/state";
import { motion } from "framer-motion";

interface PlaceProps {
  name: Locations;
  turn: number;
  icon: ReactNode;
}

const places: PlaceProps[] = [
  {
    name: Locations.Central,
    turn: 1,
    icon: <CentralPark />,
  },
  {
    name: Locations.Queens,
    turn: 1,
    icon: <Queens />,
  },
  {
    name: Locations.Bronx,
    turn: 1,
    icon: <StatenIsland />,
  },
  {
    name: Locations.Jersey,
    turn: 1,
    icon: <Manhattan />,
  },
  {
    name: Locations.Coney,
    turn: 1,
    icon: <ConeyIsland />,
  },
  {
    name: Locations.Brooklyn,
    turn: 1,
    icon: <Brooklyn />,
  },
];

export default function Travel() {
  const router = useRouter();
  const [target, setTarget] = useState<Locations>(Locations.Central);

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
    const idx = places.findIndex((place) => place.name === target);
    if (idx < places.length - 1) {
      setTarget(places[idx + 1].name);
    } else {
      setTarget(places[0].name);
    }
  }, [target]);

  const back = useCallback(() => {
    const idx = places.findIndex((place) => place.name === target);
    if (idx > 0) {
      setTarget(places[idx - 1].name);
    } else {
      setTarget(places[places.length - 1].name);
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
            places.map((place, index) => (
              <Place
                {...place}
                key={index}
                selected={place.name === target}
                onClick={() => setTarget(place.name)}
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
            onClick={() => router.push("/0x123/location/brooklyn")}
          >{`Travel to ${target}`}</Button>
        </VStack>
      </Footer>
    </Layout>
  );
}

const Place = ({
  name,
  turn,
  icon,
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
} & PlaceProps) => {
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
