import { useMemo } from "react";
import { useSql } from "./useSql";
import { addAddressPadding, shortString } from "starknet";
import { useAccount } from "@starknet-react/core";
import { useConfigStore } from "./useConfigStore";

const sqlQuery = (playerAddress: string, seasonVersion: number) => `SELECT season_version,
game_id,
player_id,
"player_name.value",
game_mode,
token_id,
"token_id.guestlootid",
"token_id.lootid",
"token_id.hustlerid"
FROM "dopewars-Game"
WHERE player_id = "${addAddressPadding(playerAddress)}"
AND game_over = 0
AND season_version = ${seasonVersion}
ORDER BY game_id DESC
LIMIT 1000;`;

export const useYourGames = () => {
  const { account } = useAccount();
  const { config } = useConfigStore();

  const currentSeasonVersion = config?.ryo.season_version;

  // Skip query if no account is connected
  const query = account?.address && currentSeasonVersion
    ? sqlQuery(account.address, currentSeasonVersion)
    : "";
  const shouldSkip = !account?.address || !currentSeasonVersion;

  const { data, isFetching, refetch } = useSql(query);

  // console.log("[useYourGames DEBUG]", {
  //   hasAccount: !!account?.address,
  //   hasConfig: !!currentSeasonVersion,
  //   shouldSkip,
  //   isFetching,
  //   dataType: Array.isArray(data) ? 'array' : typeof data,
  //   dataLength: Array.isArray(data) ? data.length : 'n/a',
  // });

  const yourGames = useMemo(() => {
    if (!account || shouldSkip) return [];
    if (!data) return [];
    if (!Array.isArray(data)) return [];

    return (data || []).map((i: any) => {
      return {
        ...i,
        player_name: shortString.decodeShortString(BigInt(i["player_name.value"]).toString()),
        token_id_type: i.token_id,
        token_id: Number(i[`token_id.${i.token_id}`]),
      };
    });
  }, [data, account, shouldSkip]);

  return {
    yourGames,
    isFetchingYourGames: shouldSkip ? false : isFetching,
    refetchYourGames: refetch,
  };
};
