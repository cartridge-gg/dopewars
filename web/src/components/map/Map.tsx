import { Flex, Image, useBreakpointValue } from "@chakra-ui/react";
import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import { Locations } from "@/hooks/state";
import { HitBox } from "./HitBox";
import { Outline } from "./Outline";
import { Markers } from "./Markers";

type CoordinateType = {
  [key in Locations]: { x: number; y: number };
};

const coordinate: CoordinateType = {
  [Locations.Queens]: { x: -150, y: 0 },
  [Locations.Jersey]: { x: 150, y: 0 },
  [Locations.Bronx]: { x: 0, y: 150 },
  [Locations.Central]: { x: 0, y: 0 },
  [Locations.Coney]: { x: -150, y: -150 },
  [Locations.Brooklyn]: { x: 0, y: -150 },
};

export const Map = ({
  highlight = Locations.Central,
  onSelect,
}: {
  highlight?: Locations;
  onSelect: (selected: Locations) => void;
}) => {
  const [scope, animate] = useAnimate();
  const isMobile = useBreakpointValue([true, false]);

  useEffect(() => {
    const animation = isMobile
      ? { scale: 1.75, ...coordinate[highlight] }
      : { scale: 1, x: 0, y: 0 };
    animate(
      scope.current,
      { ...animation },
      {
        ease: "easeInOut",
        duration: 0.5,
      },
    );
  }, [highlight, isMobile, animate, scope]);

  return (
    <Flex
      userSelect="none"
      position="relative"
      maxWidth="800px"
      maxHeight="75vh"
      marginTop="25%"
      as={motion.div}
      ref={scope}
      drag={isMobile}
      dragConstraints={{
        left: -150,
        right: 150,
        top: -150,
        bottom: 150,
      }}
    >
      <Image
        src="/images/map/basemap.svg"
        position="absolute"
        top="0"
        left="0"
        boxSize="full"
        alt="ryo map"
      />

      <Markers location={highlight} />
      <Outline location={highlight} />
      <HitBox onSelect={onSelect} />
    </Flex>
  );
};
