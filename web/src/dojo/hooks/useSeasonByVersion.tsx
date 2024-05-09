import { Game, GameEdge, Season, SeasonEdge, SortedList, SortedListEdge, useGameByIdQuery, useSeasonByVersionQuery } from "@/generated/graphql";
import { useMemo } from "react";

export interface SeasonByVersionInterface {
  season?: Season;
  sortedList?: SortedList;
  isFetched: boolean;
  refetch: any;
}

export const useSeasonByVersion = (seasonId: number): SeasonByVersionInterface => {
 
  const { data, isFetched, refetch } = useSeasonByVersionQuery({
    version: seasonId,
    listId: seasonId.toString(), // important need to be string :|
  });

  const season = useMemo(() => {
    const edges = data?.seasonModels?.edges as SeasonEdge[];
    return edges?.length > 0 ? (edges[0].node as Season) : undefined;
  }, [data]);

  const sortedList = useMemo(() => {
    const edges = data?.sortedListModels?.edges as SortedListEdge[];
    return edges?.length > 0 ? (edges[0].node as SortedList) : undefined;
  }, [data]);

  return {
    season,
    sortedList,
    isFetched,
    refetch
  };
};
