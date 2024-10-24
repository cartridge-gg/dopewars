import {
  Dopewars_GameConfig as GameConfig,
  Dopewars_GameConfigEdge as GameConfigEdge,
  useGameConfigQuery,
} from "@/generated/graphql";
import { useMemo } from "react";

export interface GameConfigInterface {
  gameConfig?: GameConfig;
  isFetched: boolean;
}

export const useGameConfig = (version: number): GameConfigInterface => {
  const { data, isFetched } = useGameConfigQuery({
    version,
  });

  const gameConfig = useMemo(() => {
    const edges = data?.dopewarsGameConfigModels?.edges as GameConfigEdge[];
    return edges?.length > 0 ? (edges[0].node as GameConfig) : undefined;
  }, [data]);

  return {
    gameConfig,
    isFetched,
  };
};
