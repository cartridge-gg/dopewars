import {
  Dopewars_V0_Season as Season,
  Dopewars_V0_SeasonEdge as SeasonEdge,
  Dopewars_V0_SeasonSettings as SeasonSettings,
  Dopewars_V0_SeasonSettingsEdge as SeasonSettingsEdge,
  Dopewars_V0_SortedList as SortedList,
  Dopewars_V0_SortedListEdge as SortedListEdge,
  useSeasonsQuery,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { DW_GRAPHQL_MODEL_NS } from "../constants";

export interface SeasonInfos {
  season: Season;
  seasonSettings?: SeasonSettings;
  sortedList?: SortedList;
}

interface SeasonsInterface {
  seasons: SeasonInfos[];
  isFetched: boolean;
  refetch: any;
}

export const useSeasons = (): SeasonsInterface => {
  const { data, isFetched, refetch } = useSeasonsQuery();

  const seasons = useMemo(() => {
    if (!data) return [];

    const seasonEdges = data?.[`${DW_GRAPHQL_MODEL_NS}SeasonModels`]?.edges as SeasonEdge[];
    const sortedListEdges = data?.[`${DW_GRAPHQL_MODEL_NS}SortedListModels`]?.edges as SortedListEdge[];
    const seasonSettingsEdges = data?.[`${DW_GRAPHQL_MODEL_NS}SeasonSettingsModels`]?.edges as SeasonSettingsEdge[];

    return seasonEdges.flatMap((i: SeasonEdge) => {
      const season = i.node as Season;

      const sortedListEdge = sortedListEdges.find((i) => Number(i.node?.list_id) === season.version);
      const sortedList = sortedListEdge ? (sortedListEdge.node as SortedList) : undefined;

      const seasonSettingsEdge = seasonSettingsEdges.find((i) => Number(i.node?.season_version) === season.version);
      const seasonSettings = seasonSettingsEdge ? (seasonSettingsEdge.node as SeasonSettings) : undefined;

      if(season.version === 0 ) return []
      return [{
        season,
        seasonSettings,
        sortedList,
      }];
    });
  }, [data]);

  return {
    seasons,
    isFetched,
    refetch,
  };
};
