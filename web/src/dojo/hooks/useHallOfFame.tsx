import { useEffect, useMemo } from "react";
import { useDojoContext } from "./useDojoContext";
import { useSql } from "./useSql";
import { shortString } from "starknet";

type HallOfFameResult = ReturnType<typeof useHallOfFame>;

const sqlQuery = () => `SELECT season_version,
game_id,
player_id,
"player_name.value",
final_score,
claimable,
position,
token_id,
"token_id.guestlootid",
"token_id.lootid",
"token_id.hustlerid"
FROM "dopewars-Game" 
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
