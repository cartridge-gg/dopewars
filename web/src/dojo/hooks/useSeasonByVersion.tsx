import {
  Game,
  GameEdge,
  Season,
  SeasonEdge,
  SortedList,
  SortedListEdge,
  useGameByIdQuery,
  useSeasonByVersionQuery,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";

export interface SeasonByVersionInterface {
  season?: Season;
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
    const edges = data?.seasonModels?.edges as SeasonEdge[];
    return edges?.length > 0 ? (edges[0].node as Season) : undefined;
  }, [data]);

  const sortedList = useMemo(() => {
    const edges = data?.sortedListModels?.edges as SortedListEdge[];
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
    }, 1_000);

    return () => clearInterval(handle);
  }, []);

  return {
    season,
    sortedList,
    isSeasonOpen,
    isSeasonWashed,
    canCreateGame,
    isFetched,
    refetch,
  };
};
