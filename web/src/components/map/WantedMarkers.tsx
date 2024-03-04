import { useConfigStore, useGameStore } from "@/dojo/hooks";
import { Locations } from "@/dojo/types";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Alert } from "../icons";
import { coordinatePercent } from "./Map";

export const WantedMarkers = ({ targetId, current }: { targetId?: Locations; current?: Locations }) => {
  const { game } = useGameStore();
  const configStore = useConfigStore();

  const [wanted, setWanted] = useState<Map<number, number>>();
  const minWanted = 69;

  useEffect(() => {
    const locations = configStore.config?.location!;

    const w = new Map<number, number>();
    for (let location of locations) {
      const wanted = game?.wanted.wantedByLocation.get(location.location) || 0;
      w.set(location.location_id, wanted);
    }
    setWanted(w);
  }, [game, configStore]);

  if (!game || !configStore || !wanted) return null;

  return (
    <Box w="100%" h="100%" position="absolute">
      {/* Queens */}
      {wanted.get(Locations.Queens)! > minWanted && (
        <Alert
          position="absolute"
          left={`${coordinatePercent[Locations.Queens].x - 2}%`}
          top={`${coordinatePercent[Locations.Queens].y - 1}%`}
        />
      )}
      {/* Jersey */}
      {wanted.get(Locations.Jersey)! > minWanted && (
        <Alert
          position="absolute"
          left={`${coordinatePercent[Locations.Jersey].x - 2}%`}
          top={`${coordinatePercent[Locations.Jersey].y - 1}%`}
        />
      )}
      {/* Bronx */}
      {wanted.get(Locations.Bronx)! > minWanted && (
        <Alert
          position="absolute"
          left={`${coordinatePercent[Locations.Bronx].x - 2}%`}
          top={`${coordinatePercent[Locations.Bronx].y - 1}%`}
        />
      )}
      {/* Central */}
      {wanted.get(Locations.Central)! > minWanted && (
        <Alert
          position="absolute"
          left={`${coordinatePercent[Locations.Central].x - 2}%`}
          top={`${coordinatePercent[Locations.Central].y - 1}%`}
        />
      )}
      {/* Coney */}
      {wanted.get(Locations.Coney)! > minWanted && (
        <Alert
          position="absolute"
          left={`${coordinatePercent[Locations.Coney].x - 2}%`}
          top={`${coordinatePercent[Locations.Coney].y - 1}%`}
        />
      )}
      {/* Brooklyn */}
      {wanted.get(Locations.Brooklyn)! > minWanted && (
        <Alert
          position="absolute"
          left={`${coordinatePercent[Locations.Brooklyn].x - 2}%`}
          top={`${coordinatePercent[Locations.Brooklyn].y - 1}%`}
        />
      )}
    </Box>
  );
};
