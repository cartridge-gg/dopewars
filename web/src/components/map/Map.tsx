import { useConfigStore, useGameStore } from "@/dojo/hooks";
import { Locations } from "@/dojo/types";
import { Flex, Image, useBreakpointValue } from "@chakra-ui/react";
import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import { HitBox } from "./HitBox";
import { Outline } from "./Outline";
import { WantedMarkers } from "./WantedMarkers";

type CoordinateType = {
  [key in Locations]: { x: number; y: number };
};

const coordinate: CoordinateType = {
  [Locations.Home]: { x: 0, y: 0 },
  [Locations.Queens]: { x: -150, y: 150 },
  [Locations.Jersey]: { x: 150, y: 150 },
  [Locations.Bronx]: { x: 0, y: 300 },
  [Locations.Central]: { x: 0, y: 150 },
  [Locations.Coney]: { x: -150, y: -0 },
  [Locations.Brooklyn]: { x: 0, y: -0 },
};

export const coordinatePercent: CoordinateType = {
  [Locations.Home]: { x: 35, y: 77 },
  [Locations.Queens]: { x: 74, y: 53 },
  [Locations.Jersey]: { x: 28, y: 39 },
  [Locations.Bronx]: { x: 53.5, y: 17 },
  [Locations.Central]: { x: 47.5, y: 46 },
  [Locations.Coney]: { x: 75, y: 80 },
  [Locations.Brooklyn]: { x: 47, y: 72 },
};

const yOffset = -180;

export const Map = ({
  targetId,
  current,
  onSelect,
}: {
  targetId?: Locations;
  current?: Locations;
  onSelect: (selected: Locations) => void;
}) => {
  const [scope, animate] = useAnimate();
  const isMobile = useBreakpointValue([true, false]);
  const [isFirstTurn, setIsFirstTurn] = useState(false);

  const { game } = useGameStore();
  const configStore = useConfigStore();

  useEffect(() => {
    setIsFirstTurn(game?.player.turn === 0);
  }, []);

  useEffect(() => {
    if (targetId !== undefined) {
      const point = coordinate[targetId] ? coordinate[targetId] : { x: 0, y: 0 };
      const animation = isMobile
        ? {
            scale: 1.25,
            x: point.x * 0.5,
            y: point.y * 0.5 + yOffset,
          }
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
  }, [targetId, isMobile, animate, scope]);

  return (
    <Flex
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
      mt={12}
    >
      <Image src="/images/map/basemap.svg" position="absolute" top="0" left="0" boxSize="full" alt="ryo map" />

      {targetId && game && (
        <Outline
          targetId={targetId}
          current={current}
          wantedTarget={game.wanted.wantedByLocation.get(configStore.getLocationById(targetId)?.location) || 0}
          wantedCurrent={
            current ? game.wanted.wantedByLocation.get(configStore.getLocationById(current)?.location) || 0 : 0
          }
          isFirstTurn={isFirstTurn}
        />
      )}
      <HitBox onSelect={onSelect} />
      {/* <Markers location={targetId} /> */}
      <WantedMarkers targetId={targetId} current={current} />
    </Flex>
  );
};
