import { Box, Flex, Image, chakra, shouldForwardProp } from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";

export enum Locations {
  Queens = "Queens",
  Jersey = "Jersey City",
  Bronx = "The Bronx",
  Central = "Central Park",
  Coney = "Coney Island",
  Brooklyn = "Brooklyn",
}

export const Map = ({
  highlight = Locations.Central,
}: {
  highlight?: Locations;
}) => {
  return (
    <Flex pointerEvents="none">
      <Image
        src="/images/map/basemap.svg"
        position="absolute"
        top="0"
        left="0"
        boxSize="full"
      />
      <Outline location={highlight} />
    </Flex>
  );
};

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const Outline = ({ location }: { location: Locations }) => {
  const key = Object.values(Locations).indexOf(location);
  const name = Object.keys(Locations)[key].toLowerCase();
  return (
    <>
      <ChakraBox
        position="absolute"
        top="0"
        left="0"
        boxSize="full"
        as={motion.div}
        animate={{ opacity: [0.5, 1, 0.5] }}
        // @ts-ignore
        transition={{
          repeat: Infinity,
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <Image src={`/images/map/${name}_outline.svg`} boxSize="full" />
      </ChakraBox>
      <ChakraBox
        position="absolute"
        top="0"
        left="0"
        boxSize="full"
        as={motion.div}
        animate={{ y: [0, -10, 0] }}
        // @ts-ignore
        transition={{
          repeat: Infinity,
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <Image src={`/images/map/${name}_callout.svg`} boxSize="full" />
      </ChakraBox>
      <Image
        position="absolute"
        top="0"
        left="0"
        boxSize="full"
        src={`/images/map/${name}_markers.svg`}
      />
    </>
  );
};
