import {
  Dopewars_Game as Game,
  Dopewars_GameEdge as GameEdge,
  useGameByIdQuery,
  useRegisteredGamesBySeasonQuery,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { useDojoClients } from "./useDojoClients";
import { useDojoContext } from "./useDojoContext";
import { useSql } from "./useSql";
import { shortString } from "starknet";

interface RegisteredGamesBySeasonInterface {
  registeredGames: Game[];
  isFetched: boolean;
  isFetching: boolean;
  refetch: any;
}

const sqlQuery = (season_version: string) => `SELECT season_version,
g.game_id,
g.player_id,
"player_name.value",
hustler_id,
final_score,
registered,
claimed,
claimable,
position,
multiplier,
gt.token_id,
gt."token_id.guestlootid",
gt."token_id.lootid",
gt."token_id.hustlerid"
FROM "dopewars-Game" as g
LEFT
JOIN "dopewars-GameWithTokenId" as gt on g.game_id = gt.game_id
AND g.player_id = gt.player_id
where season_version = ${season_version} and registered = true
ORDER BY final_score DESC
LIMIT 1000;`;


export const useRegisteredGamesBySeason = (version: number): RegisteredGamesBySeasonInterface => {
  // const { data, isFetched, isFetching, refetch } = useRegisteredGamesBySeasonQuery({
  //   version,
  // });

  const { data, isFetched, isFetching, refetch } = useSql(sqlQuery((version || 0).toString()));

  const registeredGames = useMemo(() => {
    // const edges = data?.dopewarsGameModels?.edges as GameEdge[];
    // const games = edges?.length > 0 ? edges.map((i) => i.node as Game) : [];
    const games = (data || []).map((i: any) => {
      return {
        ...i,
        player_name: shortString.decodeShortString(BigInt(i["player_name.value"]).toString()),
        token_id_type: i.token_id,
        token_id: Number(i[`token_id.${i.token_id}`]),
      };
    });

    return games.sort((a: Game, b: Game) => {
      const bPos = b.position > 0 ? (9999 - b.position) * 1_000_000_000 : 0;
      const aPos = a.position > 0 ? (9999 - a.position) * 1_000_000_000 : 0;
      return bPos + b.final_score - (aPos + a.final_score);
    });
  }, [data]);

  return {
    registeredGames,
    isFetched,
    isFetching,
    refetch,
  };
};
