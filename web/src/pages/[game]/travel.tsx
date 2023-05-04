import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
import { Car } from "@/components/icons";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { HStack, VStack, Text, Spacer, Divider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import {
  Brooklyn,
  CentralPark,
  ConeyIsland,
  Manhattan,
  Queens,
  StatenIsland,
} from "@/components/icons/locations";
import { breakpoint } from "@/utils/ui";
import { Map, Locations } from "@/components/Map";

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
    icon: <Brooklyn />,
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
];

export default function Travel() {
  const router = useRouter();
  const [target, setTarget] = useState<Locations>(Locations.Central);
  return (
    <Layout
      title="Destination"
      prefixTitle="Select Your"
      map={<Map highlight={target} />}
    >
      <Content>
        <Car boxSize="60px" />
        <VStack w="full">
          {places.map((place, index) => (
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
        <Button
          w={breakpoint("full", "auto")}
          onClick={() => router.push("/0x123/location/brooklyn")}
        >{`Travel to ${target}`}</Button>
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
    <HStack
      layerStyle={selected ? "rounded" : ""}
      w="full"
      py="12px"
      px="20px"
      cursor="pointer"
      onClick={onClick}
    >
      <HStack>
        {icon}
        <Text whiteSpace="nowrap">{name}</Text>
      </HStack>
      <Divider borderStyle="dotted" borderColor="neon.700" />
      <Text whiteSpace="nowrap">{turn} DAY</Text>
    </HStack>
  );
};
