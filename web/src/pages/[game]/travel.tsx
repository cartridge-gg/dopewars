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

interface PlaceProps {
  name: string;
  turn: number;
  icon: ReactNode;
}

const places: PlaceProps[] = [
  {
    name: "Manhattan",
    turn: 1,
    icon: <Manhattan />,
  },
  {
    name: "Queens",
    turn: 1,
    icon: <Queens />,
  },
  {
    name: "Central Park",
    turn: 1,
    icon: <CentralPark />,
  },
  {
    name: "Staten Island",
    turn: 1,
    icon: <StatenIsland />,
  },
  {
    name: "The Bronx",
    turn: 1,
    icon: <ConeyIsland />,
  },
];

export default function Travel() {
  const router = useRouter();
  const [target, setTarget] = useState<number>(0);
  return (
    <Layout
      title="Destination"
      prefixTitle="Select Your"
      backgroundImage="url('https://static.cartridge.gg/games/dope-wars/ryo/map.png');"
    >
      <Content>
        <Car boxSize="60px" />
        <VStack w="full">
          {places.map((place, index) => (
            <Place
              {...place}
              key={index}
              selected={target === index}
              onClick={() => setTarget(index)}
            />
          ))}
        </VStack>
      </Content>
      <Footer>
        <Button
          onClick={() => router.push("/0x123/location/brooklyn")}
        >{`Travel to ${places[target].name}`}</Button>
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
