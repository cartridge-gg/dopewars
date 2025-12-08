import { Dopewars_V0_Game as Game } from "@/generated/graphql";
import { useMemo } from "react";
import { useSql } from "./useSql";
import { shortString } from "starknet";
import { DW_NS } from "../constants";
import { useDojoContext } from "./useDojoContext";
import Bits from "../class/utils/Bits";

interface ActiveGamesBySeasonInterface {
  activeGames: Game[];
  isFetched: boolean;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

// Join Game table with GameStorePacked to get the packed data for cash extraction
const sqlQuery = (season_version: string) => `SELECT g.season_version,
g.game_id,
g.player_id,
g."player_name.value",
g.final_score,
g.registered,
g.game_over,
g.claimed,
g.claimable,
g.position,
g.multiplier,
g.token_id,
g."token_id.guestlootid",
g."token_id.lootid",
g."token_id.hustlerid",
gsp.packed
FROM "${DW_NS}-Game" g
LEFT JOIN "${DW_NS}-GameStorePacked" gsp ON g.game_id = gsp.game_id
WHERE g.season_version = ${season_version} AND g.game_over = false
ORDER BY g.final_score DESC
LIMIT 100;`;

export const useActiveGamesBySeason = (version: number): ActiveGamesBySeasonInterface => {
  const { data, isFetched, isFetching, refetch } = useSql(sqlQuery((version || 0).toString()));
  const { configStore } = useDojoContext();

  const activeGames = useMemo(() => {
    // Get the player layout for cash extraction
    const cashLayout = configStore?.getPlayerLayoutItem?.("Cash");
    const playerLayout = configStore?.getGameStoreLayoutItem?.("Player");

    const games = (data || []).map((i: any) => {
      let currentCash = 0;

      // Extract cash from packed data if available
      if (i.packed && cashLayout && playerLayout) {
        try {
          const packed = BigInt(i.packed);
          // First extract the player bits from GameStorePacked
          const playerPacked = Bits.extract(packed, playerLayout.idx, playerLayout.bits);
          // Then extract cash from player bits
          currentCash = Number(Bits.extract(playerPacked, cashLayout.idx, cashLayout.bits));
        } catch (e) {
          console.error("Failed to extract cash from packed data:", e);
        }
      }

      return {
        ...i,
        player_name: i["player_name.value"]
          ? shortString.decodeShortString(BigInt(i["player_name.value"]).toString())
          : "Anonymous",
        token_id_type: i.token_id,
        token_id: Number(i[`token_id.${i.token_id}`]),
        // Use extracted cash for active games, fall back to final_score (0) if extraction fails
        final_score: currentCash || i.final_score,
      };
    });

    return games.sort((a: Game, b: Game) => b.final_score - a.final_score);
  }, [data, configStore]);

  return {
    activeGames,
    isFetched,
    isFetching,
    refetch,
  };
};
