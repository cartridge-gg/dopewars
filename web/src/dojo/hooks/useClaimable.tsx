import { Dopewars_Game as Game, World__ModelEdge, useClaimableQuery } from "@/generated/graphql";
import { useEffect, useMemo } from "react";
import { useDojoContext } from "./useDojoContext";
import { useSql } from "./useSql";
import { addAddressPadding, shortString } from "starknet";

type ClaimableResult = ReturnType<typeof useClaimable>;

const sqlQuery = (playerId: string) => `SELECT season_version,
g.game_id,
g.player_id,
"player_name.value",
hustler_id,
final_score,
claimable,
claimed,
position,
gt.token_id,
gt."token_id.guestlootid",
gt."token_id.lootid",
gt."token_id.hustlerid"
FROM "dopewars-Game" as g
LEFT
JOIN "dopewars-GameWithTokenId" as gt on g.game_id = gt.game_id
AND g.player_id = gt.player_id
WHERE g.player_id = "${addAddressPadding(playerId)}" AND claimed = false AND claimable > 0
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
  }, [selectedChain.toriiUrl]);

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
