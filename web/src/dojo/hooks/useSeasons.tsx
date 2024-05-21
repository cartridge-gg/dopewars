import {
  Game,
  GameEdge,
  Season,
  SeasonEdge,
  SeasonSettings,
  SeasonSettingsEdge,
  SortedList,
  SortedListEdge,
  useGameByIdQuery,
  useSeasonByVersionQuery,
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

    const seasonEdges = data?.seasonModels?.edges as SeasonEdge[];
    const sortedListEdges = data?.sortedListModels?.edges as SortedListEdge[];
    const seasonSettingsEdges = data?.seasonSettingsModels?.edges as SeasonSettingsEdge[];

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
