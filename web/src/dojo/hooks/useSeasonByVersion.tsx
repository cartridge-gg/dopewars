import {
  Dopewars_V0_Season as Season,
  Dopewars_V0_SeasonEdge as SeasonEdge,
  Dopewars_V0_SeasonSettings as SeasonSettings,
  Dopewars_V0_SeasonSettingsEdge as SeasonSettingsEdge,
  Dopewars_V0_SortedList as SortedList,
  Dopewars_V0_SortedListEdge as SortedListEdge,
  useSeasonByVersionQuery,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { DW_GRAPHQL_MODEL_NS } from "../constants";

export interface SeasonByVersionInterface {
  season?: Season;
  seasonSettings?: SeasonSettings;
  sortedList?: SortedList;
  isSeasonOpen: boolean;
  isSeasonWashed: boolean;
  canCreateGame: boolean;
  isFetched: boolean;
  refetch: any;
}

export const useSeasonByVersion = (seasonId: number): SeasonByVersionInterface => {
  const [timestamp, setTimestamp] = useState(Date.now());

  const { data, isFetched, refetch } = useSeasonByVersionQuery({
    version: seasonId || 0,
    listId: (seasonId || 0).toString(), // important need to be string :|
  });

  const season = useMemo(() => {
    const edges = data?.[`${DW_GRAPHQL_MODEL_NS}SeasonModels`]?.edges as SeasonEdge[];
    return edges?.length > 0 ? (edges[0].node as Season) : undefined;
  }, [data]);

  const seasonSettings = useMemo(() => {
    const edges = data?.[`${DW_GRAPHQL_MODEL_NS}SeasonSettingsModels`]?.edges as SeasonSettingsEdge[];
    return edges?.length > 0 ? (edges[0].node as SeasonSettings) : undefined;
  }, [data]);

  const sortedList = useMemo(() => {
    const edges = data?.[`${DW_GRAPHQL_MODEL_NS}SortedListModels`]?.edges as SortedListEdge[];
    return edges?.length > 0 ? (edges[0].node as SortedList) : undefined;
  }, [data]);

  const isSeasonOpen = useMemo(() => {
    return timestamp < season?.next_version_timestamp * 1000;
  }, [season, timestamp]);

  const canCreateGame = useMemo(() => {
    return timestamp < (season?.next_version_timestamp - season?.season_time_limit) * 1000;
  }, [season, timestamp]);

  const isSeasonWashed = useMemo(() => {
    return sortedList?.processed;
  }, [sortedList]);

  useEffect(() => {
    const handle = setInterval(() => {
      setTimestamp(Date.now());
    }, 5_000);

    return () => clearInterval(handle);
  }, []);

  return {
    season,
    seasonSettings,
    sortedList,
    isSeasonOpen,
    isSeasonWashed,
    canCreateGame,
    isFetched,
    refetch,
  };
};
