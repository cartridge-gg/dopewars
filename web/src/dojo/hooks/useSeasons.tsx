import {
  Game,
  GameEdge,
  Season,
  SeasonEdge,
  SortedList,
  SortedListEdge,
  useGameByIdQuery,
  useSeasonByVersionQuery,
  useSeasonsQuery,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";

export interface SeasonInfos {
  season: Season;
  sortedList?: SortedList;
}

export interface SeasonsInterface {
  seasons: SeasonInfos[];
  isFetched: boolean;
  refetch: any;
}

export const useSeasons = (): SeasonsInterface => {

  const { data, isFetched, refetch } = useSeasonsQuery();

  const seasons = useMemo(() => {
    if(!data) return []
 
    const seasonEdges = data?.seasonModels?.edges as SeasonEdge[];
    const sortedListEdges = data?.sortedListModels?.edges as SortedListEdge[];

    return seasonEdges.map((i: SeasonEdge) => {
      const season = i.node as Season;
      const sortedListEdge = sortedListEdges.find((i) => Number(i.node?.list_id) === season.version);
      const sortedList = sortedListEdge ? (sortedListEdge.node as SortedList) : undefined;

      return {
        season,
        sortedList,
      };
    });
  }, [data]);

 
  return {
    seasons,
    isFetched,
    refetch,
  };
};
