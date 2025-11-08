import { Dopewars_V0_Game as Game, World__ModelEdge, useClaimableQuery } from "@/generated/graphql";
import { useEffect, useMemo } from "react";
import { useDojoContext } from "./useDojoContext";
import { useSql } from "./useSql";
import { addAddressPadding, shortString } from "starknet";
import { DW_NS } from "../constants";
import { useSeasons } from "./useSeasons";

type ClaimableResult = ReturnType<typeof useClaimable>;

const sqlQuery = (playerId: string) => `SELECT season_version,
game_id,
player_id,
"player_name.value",
final_score,
claimable,
claimed,
position,
token_id,
"token_id.guestlootid",
"token_id.lootid",
"token_id.hustlerid"
FROM "${DW_NS}-Game" 
WHERE player_id = "${addAddressPadding(playerId)}" AND claimed = false AND claimable > 0
ORDER BY position ASC
LIMIT 1000;`;

export const useClaimable = (playerId: string) => {
  const {
    chains: { selectedChain },
  } = useDojoContext();

  const query = useMemo(() => {
    return sqlQuery(playerId);
  }, [playerId]);
  const { data, isFetched, isFetching, refetch } = useSql(query);

  useEffect(() => {
    if (Number(playerId) > 0) {
      refetch();
    }
  }, [selectedChain.toriiUrl, playerId, refetch]);

  const claimable = useMemo(() => {
    if (isFetching || !data) return [];

    return (data || []).map((i: any) => {
      return {
        ...i,
        player_name: shortString.decodeShortString(BigInt(i["player_name.value"]).toString()),
        token_id_type: i.token_id,
        token_id: Number(i[`token_id.${i.token_id}`]),
      };
    });
  }, [data, isFetching]);

  return {
    claimable,
    isFetching,
    refetch,
  };
};
