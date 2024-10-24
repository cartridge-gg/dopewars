import {
  Dopewars_Season as Season,
  Dopewars_SeasonEdge as SeasonEdge,
  Dopewars_SeasonSettings as SeasonSettings,
  Dopewars_SeasonSettingsEdge as SeasonSettingsEdge,
  Dopewars_SortedList as SortedList,
  Dopewars_SortedListEdge as SortedListEdge,
  useSeasonsQuery,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";

export interface SeasonInfos {
  season: Season;
  seasonSettings?: SeasonSettings;
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
    if (!data) return [];

    const seasonEdges = data?.dopewarsSeasonModels?.edges as SeasonEdge[];
    const sortedListEdges = data?.dopewarsSortedListModels?.edges as SortedListEdge[];
    const seasonSettingsEdges = data?.dopewarsSeasonSettingsModels?.edges as SeasonSettingsEdge[];

    return seasonEdges.map((i: SeasonEdge) => {
      const season = i.node as Season;

      const sortedListEdge = sortedListEdges.find((i) => Number(i.node?.list_id) === season.version);
      const sortedList = sortedListEdge ? (sortedListEdge.node as SortedList) : undefined;

      const seasonSettingsEdge = seasonSettingsEdges.find((i) => Number(i.node?.season_version) === season.version);
      const seasonSettings = seasonSettingsEdge ? (seasonSettingsEdge.node as SeasonSettings) : undefined;

      return {
        season,
        seasonSettings,
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
