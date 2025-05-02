import { useEffect, useMemo } from "react";
import { useDojoContext } from "./useDojoContext";
import { useSql } from "./useSql";
import { shortString } from "starknet";

type HallOfFameResult = ReturnType<typeof useHallOfFame>;

const sqlQuery = () => `SELECT season_version,
g.game_id,
g.player_id,
"player_name.value",
hustler_id,
final_score,
claimable,
position,
gt.token_id,
gt."token_id.guestlootid",
gt."token_id.lootid",
gt."token_id.hustlerid"
FROM "dopewars-Game" as g
LEFT
JOIN "dopewars-GameWithTokenId" as gt on g.game_id = gt.game_id
AND g.player_id = gt.player_id
WHERE position = 1
ORDER BY season_version DESC
LIMIT 1000;`;

export const useHallOfFame = () => {
  const {
    chains: { selectedChain },
  } = useDojoContext();

  const { data, isFetched, isFetching, refetch } = useSql(sqlQuery());


  const hallOfFame = useMemo(() => {
    if (!data) return [];

    return (data || []).map((i: any) => {
      return {
        ...i,
        player_name: shortString.decodeShortString(BigInt(i["player_name.value"]).toString()),
        token_id_type: i.token_id,
        token_id: Number(i[`token_id.${i.token_id}`]),
      };
    });
  }, [data]);

  return {
    hallOfFame,
    isFetchingHallOfFame: isFetching,
    refetchHallOfFame: refetch,
  };
};
