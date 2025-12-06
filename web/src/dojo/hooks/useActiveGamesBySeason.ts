import { Dopewars_V0_Game as Game } from "@/generated/graphql";
import { useMemo } from "react";
import { useSql } from "./useSql";
import { shortString } from "starknet";
import { DW_NS } from "../constants";

interface ActiveGamesBySeasonInterface {
  activeGames: Game[];
  isFetched: boolean;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

const sqlQuery = (season_version: string) => `SELECT season_version,
game_id,
player_id,
"player_name.value",
final_score,
registered,
game_over,
claimed,
claimable,
position,
multiplier,
token_id,
"token_id.guestlootid",
"token_id.lootid",
"token_id.hustlerid"
FROM "${DW_NS}-Game"
WHERE season_version = ${season_version} AND game_over = false
ORDER BY final_score DESC
LIMIT 100;`;

export const useActiveGamesBySeason = (version: number): ActiveGamesBySeasonInterface => {
  const { data, isFetched, isFetching, refetch } = useSql(sqlQuery((version || 0).toString()));

  const activeGames = useMemo(() => {
    const games = (data || []).map((i: any) => {
      return {
        ...i,
        player_name: i["player_name.value"]
          ? shortString.decodeShortString(BigInt(i["player_name.value"]).toString())
          : "Anonymous",
        token_id_type: i.token_id,
        token_id: Number(i[`token_id.${i.token_id}`]),
      };
    });

    return games.sort((a: Game, b: Game) => b.final_score - a.final_score);
  }, [data]);

  return {
    activeGames,
    isFetched,
    isFetching,
    refetch,
  };
};
