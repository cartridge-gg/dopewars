import { Flex, Image, useBreakpointValue } from "@chakra-ui/react";
import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import { Locations } from "@/hooks/state";
import { HitBox } from "./HitBox";
import { Outline } from "./Outline";
import { Markers } from "./Markers";

type CoordinateType = {
  [key in Locations]: { x: number; y: number };
};

const coordinate: CoordinateType = {
  [Locations.Queens]: { x: -150, y: 150 },
  [Locations.Jersey]: { x: 150, y: 150 },
  [Locations.Bronx]: { x: 0, y: 300 },
  [Locations.Central]: { x: 0, y: 150 },
  [Locations.Coney]: { x: -150, y: -0 },
  [Locations.Brooklyn]: { x: 0, y: -0 },
};

export const Map = ({
  highlight,
  onSelect,
}: {
  highlight?: Locations;
  onSelect: (selected: Locations) => void;
}) => {
  const [scope, animate] = useAnimate();
  const isMobile = useBreakpointValue([true, false]);

  useEffect(() => {
    if (highlight) {
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
    }
  }, [highlight, isMobile, animate, scope]);

  return (
    <Flex
      zIndex="1"
      userSelect="none"
      position="relative"
      w="inherit"
      as={motion.div}
      ref={scope}
      drag={isMobile}
      dragConstraints={{
        left: -150,
        right: 150,
        top: -150,
        bottom: 300,
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
