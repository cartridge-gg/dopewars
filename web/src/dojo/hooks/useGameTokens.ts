import { useDojoContext } from "./useDojoContext";
import { addAddressPadding, shortString } from "starknet";
import { useCallback, useMemo } from "react";
import { GameTokenData, EnrichedGame } from "../types";

// Constants
const ZERO_BALANCE_HEX = "0x0000000000000000000000000000000000000000000000000000000000000000";
const HEX_PADDING_LENGTH = 16; // u64 requires 16 hex digits
const TOKEN_QUERY_LIMIT = 10000;
const GAME_QUERY_LIMIT = 1000;

interface TokenBalanceResponse {
  token_id: string;
}

interface GameQueryResponse {
  season_version: number;
  game_id: number;
  player_id: string;
  "player_name.value": string;
  game_mode: string;
  game_over: number;
  final_score: number;
  token_id: string;
  "token_id.guestlootid": string | null;
  "token_id.lootid": string | null;
  "token_id.hustlerid": string | null;
  minigame_token_id: string;
  equipment_by_slot: string;
}

// Helper functions
/**
 * Parse token ID from the format "contract_address:token_id_hex"
 */
const parseTokenId = (tokenIdString: string): number => {
  const hexId = tokenIdString.split(":")[1];
  return parseInt(hexId, 16);
};

/**
 * Convert decimal token ID to padded hex format for SQL queries
 * @example convertToHexTokenId(29) => "0x000000000000001d"
 */
const convertToHexTokenId = (tokenId: number): string => {
  const hex = tokenId.toString(16).padStart(HEX_PADDING_LENGTH, '0');
  return `"0x${hex}"`;
};

export const useGameTokens = () => {
  const {
    chains: { selectedChain },
  } = useDojoContext();

  const SQL_ENDPOINT = useMemo(
    () => selectedChain.toriiUrl.replace(/\/graphql$/, "/sql"),
    [selectedChain.toriiUrl]
  );

  /**
   * Execute a SQL query against the Torii SQL endpoint
   */
  const executeSqlQuery = useCallback(
    async <T = any>(query: string): Promise<T[]> => {
      const url = `${SQL_ENDPOINT}/?query=${encodeURIComponent(query)}`;

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
        console.error("[useGameTokens] SQL query error:", error);
        return [];
      }
    },
    [SQL_ENDPOINT]
  );

  /**
   * Fetch owned game token IDs from token_balances table.
   * Filters out transferred tokens by checking balance != 0.
   *
   * @param accountAddress - The wallet address to query
   * @param tokenAddress - The ERC721 token contract address
   * @returns Array of token IDs owned by the account
   */
  const getGameTokens = useCallback(
    async (accountAddress: string, tokenAddress: string): Promise<number[]> => {
      const paddedAccountAddress = addAddressPadding(accountAddress);
      const paddedTokenAddress = addAddressPadding(tokenAddress);

      const query = `
        SELECT token_id
        FROM token_balances
        WHERE account_address = "${paddedAccountAddress}"
          AND contract_address = "${paddedTokenAddress}"
          AND balance != "${ZERO_BALANCE_HEX}"
        LIMIT ${TOKEN_QUERY_LIMIT}
      `;

      const data = await executeSqlQuery<TokenBalanceResponse>(query);
      return data.map((token) => parseTokenId(token.token_id));
    },
    [executeSqlQuery]
  );

  /**
   * Fetch game data for owned tokens from dopewars-Game models.
   * Converts token IDs to hex format and queries the database.
   *
   * @param gamesData - Array of GameTokenData with token_id field
   * @param seasonVersion - Current season version to filter by
   * @returns Array of enriched game data
   */
  const fetchGameData = useCallback(
    async (gamesData: GameTokenData[], seasonVersion: number): Promise<EnrichedGame[]> => {
      if (!gamesData || gamesData.length === 0) {
        return [];
      }

      // Convert decimal token IDs to padded hex format for SQL query
      // Note: minigame_token_id is stored as hex (u64 = 16 hex digits) in the database
      const tokenIdsHex = gamesData
        .map((game) => convertToHexTokenId(game.token_id))
        .join(",");

      const query = `
        SELECT
          season_version,
          game_id,
          player_id,
          "player_name.value",
          game_mode,
          game_over,
          final_score,
          token_id,
          "token_id.guestlootid",
          "token_id.lootid",
          "token_id.hustlerid",
          minigame_token_id,
          equipment_by_slot
        FROM "dopewars-Game"
        WHERE minigame_token_id IN (${tokenIdsHex})
          AND season_version = ${seasonVersion}
        ORDER BY game_id DESC
        LIMIT ${GAME_QUERY_LIMIT}
      `;

      const data = await executeSqlQuery<GameQueryResponse>(query);

      // Enrich game data with metagame metadata and convert hex values
      return data.map((gameData) => {
        const minigameTokenIdDecimal = parseInt(gameData.minigame_token_id, 16);
        const metagameData = gamesData.find((g) => g.token_id === minigameTokenIdDecimal);

        return {
          ...gameData,
          player_name: shortString.decodeShortString(
            BigInt(gameData["player_name.value"]).toString()
          ),
          token_id_type: gameData.token_id,
          token_id: Number(gameData[`token_id.${gameData.token_id}` as keyof GameQueryResponse]),
          minigame_token_id: minigameTokenIdDecimal,
          minted_by: metagameData?.minted_by,
          lifecycle: metagameData?.lifecycle,
        };
      });
    },
    [executeSqlQuery]
  );

  return {
    getGameTokens,
    fetchGameData,
  };
};
