import { useCallback, useEffect, useMemo, useState } from "react";
import { getContractByName } from "@dojoengine/core";
import { DW_NS } from "./useSystems";
import { useDojoContext } from "./useDojoContext";
import { addAddressPadding, shortString } from "starknet";

const ZERO_BALANCE_HEX = "0x0000000000000000000000000000000000000000000000000000000000000000";
const HEX_PADDING_LENGTH = 16;
const TOKEN_QUERY_LIMIT = 10000;
const CLAIM_QUERY_LIMIT = 1000;

interface TokenBalanceRow {
  token_id: string;
}

interface ClaimableRow {
  season_version: number;
  game_id: number;
  player_id: string;
  "player_name.value": string;
  final_score: number;
  claimable: number;
  claimed: number;
  position: number;
  token_id: string;
  "token_id.guestlootid": string | null;
  "token_id.lootid": string | null;
  "token_id.hustlerid": string | null;
  minigame_token_id: string;
}

const parseTokenId = (tokenIdString: string): number => {
  const hexId = tokenIdString.split(":")[1];
  return parseInt(hexId, 16);
};

const convertToHexTokenId = (tokenId: number): string => {
  const hex = tokenId.toString(16).padStart(HEX_PADDING_LENGTH, "0");
  return `"0x${hex}"`;
};

export const useClaimable = (playerId: string) => {
  const {
    chains: { selectedChain },
    clients: { rpcProvider },
  } = useDojoContext();

  const sqlEndpoint = useMemo(
    () => selectedChain.toriiUrl.replace(/\/graphql$/, "/sql"),
    [selectedChain.toriiUrl],
  );

  const [claimable, setClaimable] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const executeSqlQuery = useCallback(
    async <T = any>(query: string): Promise<T[]> => {
      const url = `${sqlEndpoint}/?query=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`SQL query failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error("[useClaimable] SQL query error:", error);
        return [];
      }
    },
    [sqlEndpoint],
  );

  const fetchTokenAddress = useCallback(async (): Promise<string | undefined> => {
    try {
      const contract = getContractByName(selectedChain.manifest, DW_NS, "game_token_system_v0");
      if (!contract?.address) {
        console.error("[useClaimable] game_token_system_v0 contract not found");
        return undefined;
      }

      const result = await rpcProvider.callContract(
        {
          contractAddress: contract.address,
          entrypoint: "token_address",
        },
        "latest",
      );

      return result?.[0];
    } catch (error) {
      console.error("[useClaimable] Failed to resolve game token address:", error);
      return undefined;
    }
  }, [rpcProvider, selectedChain.manifest]);

  const fetchOwnedTokenIds = useCallback(
    async (owner: string, tokenAddress: string): Promise<number[]> => {
      const paddedOwner = addAddressPadding(owner);
      const paddedToken = addAddressPadding(tokenAddress);

      const query = `
        SELECT token_id
        FROM token_balances
        WHERE account_address = "${paddedOwner}"
          AND contract_address = "${paddedToken}"
          AND balance != "${ZERO_BALANCE_HEX}"
        LIMIT ${TOKEN_QUERY_LIMIT};
      `;

      const rows = await executeSqlQuery<TokenBalanceRow>(query);
      return rows.map((row) => parseTokenId(row.token_id)).filter((id) => Number.isFinite(id));
    },
    [executeSqlQuery],
  );

  const fetchClaimable = useCallback(async () => {
    if (!playerId || playerId === "0x0") {
      setClaimable([]);
      return;
    }

    setIsFetching(true);
    try {
      const tokenAddress = await fetchTokenAddress();
      if (!tokenAddress) {
        setClaimable([]);
        return;
      }

      const ownedTokenIds = await fetchOwnedTokenIds(playerId, tokenAddress);
      if (ownedTokenIds.length === 0) {
        setClaimable([]);
        return;
      }

      const tokenIdHexList = ownedTokenIds.map(convertToHexTokenId).join(",");
      const tokenIdDecimalList = ownedTokenIds.join(",");
      const tokenFilters: string[] = [];

      if (tokenIdHexList) {
        tokenFilters.push(`minigame_token_id IN (${tokenIdHexList})`);
      }
      if (tokenIdDecimalList) {
        tokenFilters.push(`minigame_token_id IN (${tokenIdDecimalList})`);
      }

      if (!tokenFilters.length) {
        setClaimable([]);
        return;
      }

      const tokenFilterClause = tokenFilters.length === 1 ? tokenFilters[0] : `(${tokenFilters.join(" OR ")})`;

      const claimableQuery = `
        SELECT season_version,
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
               "token_id.hustlerid",
               minigame_token_id
        FROM "dopewars-Game"
        WHERE claimed = false
          AND claimable > 0
          AND ${tokenFilterClause}
        ORDER BY position ASC
        LIMIT ${CLAIM_QUERY_LIMIT};
      `;

      const rows = await executeSqlQuery<ClaimableRow>(claimableQuery);

      const parsed = rows.map((row) => {
        const rawTokenId = (row as any)[`token_id.${row.token_id}`];
        const tokenId = rawTokenId ? Number(rawTokenId) : 0;
        const minigameTokenId = row.minigame_token_id?.startsWith("0x")
          ? Number.parseInt(row.minigame_token_id, 16)
          : Number(row.minigame_token_id);

        return {
          ...row,
          season_version: Number(row.season_version),
          final_score: Number(row.final_score),
          claimable: Number(row.claimable),
          claimed: Number(row.claimed),
          position: Number(row.position),
          player_name: shortString.decodeShortString(BigInt(row["player_name.value"]).toString()),
          token_id_type: row.token_id,
          token_id: tokenId,
          minigame_token_id: Number.isFinite(minigameTokenId) ? minigameTokenId : 0,
        };
      });

      setClaimable(parsed);
    } catch (error) {
      console.error("[useClaimable] Failed to fetch claimable rewards:", error);
      setClaimable([]);
    } finally {
      setIsFetching(false);
    }
  }, [playerId, fetchTokenAddress, fetchOwnedTokenIds, executeSqlQuery]);

  useEffect(() => {
    fetchClaimable();
  }, [fetchClaimable, selectedChain.toriiUrl]);

  return {
    claimable,
    isFetching,
    refetch: fetchClaimable,
  };
};
