import { useConfigStore, useGameStore } from "@/dojo/hooks";
import { Locations } from "@/dojo/types";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Alert } from "../icons";

export const WantedMarkers = ({ targetId, current }: { targetId?: Locations; current?: Locations }) => {
  const { game } = useGameStore();
  const configStore = useConfigStore();

  const [wanted, setWanted] = useState<Map<number, number>>();
  const minWanted = 69;

  useEffect(() => {
    const locations = configStore.config?.location;

    const w = new Map<number, number>();
    for (let location of locations) {
      const wanted = game?.wanted.wantedByLocation.get(location.location);
      w.set(location.location_id, wanted);
    }
    setWanted(w);
  }, [game, configStore]);

  if (!game || !configStore || !wanted) return null;

  return (
    <Box w="100%" h="100%" position="absolute">
      {/* Jersey */}
      {wanted.get(Locations.Jersey) > minWanted && <Alert position="absolute" top="38%" left="26%" />}
      {/* Bronx */}
      {wanted.get(Locations.Bronx) > minWanted && <Alert position="absolute" top="15%" left="52%" />}
      {/* Central */}
      {wanted.get(Locations.Central) > minWanted && <Alert position="absolute" top="44%" left="48%" />}
      {/* Brooklyn */}
      {wanted.get(Locations.Brooklyn) > minWanted && <Alert position="absolute" top="71%" left="44%" />}
      {/* Queens */}
      {wanted.get(Locations.Queens) > minWanted && <Alert position="absolute" top="52%" left="72%" />}
      {/* Coney */}
      {wanted.get(Locations.Coney) > minWanted && <Alert position="absolute" top="80%" left="75%" />}
    </Box>
  );
};
