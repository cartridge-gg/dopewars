import { useEffect, useState, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { useConfigStore } from "./useConfigStore";
import { useDojoContext } from "./useDojoContext";
import { useGameTokens } from "./useGameTokens";
import { GameTokenData, EnrichedGame } from "../types";
import { getContractByName } from "@dojoengine/core";
import { DW_NS } from "./useSystems";

/**
 * Helper function to create GameTokenData structure from token IDs
 */
const createGameTokenData = (tokenId: number, ownerAddress: string): GameTokenData => ({
  token_id: tokenId,
  game_id: undefined,
  game_over: undefined,
  lifecycle: { start: undefined, end: undefined },
  minted_at: undefined,
  minted_by: undefined,
  minted_by_address: undefined,
  owner: ownerAddress,
  settings_id: undefined,
  soulbound: undefined,
  completed_all_objectives: undefined,
  player_name: undefined,
  metadata: undefined,
  context: undefined,
  settings: undefined,
  score: 0,
  objective_ids: [],
  renderer: undefined,
  client_url: undefined,
  gameMetadata: undefined,
});

export const useYourGames = () => {
  const { account } = useAccount();
  const { config } = useConfigStore();
  const {
    chains: { selectedChain },
    clients: { rpcProvider },
  } = useDojoContext();
  const { getGameTokens, fetchGameData } = useGameTokens();

  const [yourGames, setYourGames] = useState<EnrichedGame[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [gameTokenAddress, setGameTokenAddress] = useState<string | undefined>();

  const currentSeasonVersion = config?.ryo.season_version;

  // Fetch the ERC721 token contract address from the game_token_system contract
  useEffect(() => {
    const fetchTokenAddress = async () => {
      try {
        const gameTokenContract = getContractByName(selectedChain.manifest, DW_NS, "game_token_system_v0");

        if (!gameTokenContract?.address) {
          console.error("[useYourGames] game_token_system contract not found");
          return;
        }

        const result = await rpcProvider.callContract(
          {
            contractAddress: gameTokenContract.address,
            entrypoint: "token_address",
          },
          "latest",
        );

        if (result && result.length > 0) {
          setGameTokenAddress(result[0]);
        }
      } catch (error) {
        console.error("[useYourGames] Error fetching token address:", error);
      }
    };

    fetchTokenAddress();
  }, [selectedChain.manifest, rpcProvider]);

  /**
   * NOTE: We previously attempted to replace the SQL helper with
   * `toriiClient.getTokenBalances/ getTokens`, but the gRPC gateway
   * backing our Torii deployment returned
   * `invalid tag value: 0` while decoding the protobuf payload whenever
   * we passed those filtered queries. Until that backend is upgraded
   * (or the client adapts to its expectations), we fall back to the SQL
   * helper that already filters by account.
   *
   * Load games owned by the current account.
   * Fetches token IDs from token_balances, then enriches with game data.
   */
  const loadGames = useCallback(async () => {
    if (!account?.address || !gameTokenAddress || !currentSeasonVersion) {
      setYourGames([]);
      return;
    }

    setIsFetching(true);
    try {
      const tokenIds = await getGameTokens(account.address, gameTokenAddress);

      if (tokenIds.length === 0) {
        setYourGames([]);
        return;
      }

      const gameTokensData = tokenIds.map((tokenId) => createGameTokenData(tokenId, account.address));

      const games = await fetchGameData(gameTokensData, currentSeasonVersion);

      const activeGames = games.filter((game) => !game.game_over);

      setYourGames(activeGames);
    } catch (error) {
      console.error("[useYourGames] Error loading games:", error);
      setYourGames([]);
    } finally {
      setIsFetching(false);
    }
  }, [account?.address, gameTokenAddress, currentSeasonVersion, getGameTokens, fetchGameData]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  return {
    yourGames,
    isFetchingYourGames: isFetching,
    refetchYourGames: loadGames,
  };
};
