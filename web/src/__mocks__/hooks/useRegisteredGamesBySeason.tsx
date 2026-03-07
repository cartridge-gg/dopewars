import { shortString } from "starknet";

const MOCK_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

const mockLeaderboardGames = [
  { game_id: 101, player_id: "0xaaa1", player_name: "Heisenberg", final_score: 125000, registered: true, position: 1, multiplier: 1, token_id_type: "lootid", token_id: 1, season_version: "1", game_mode: "Ranked" },
  { game_id: 102, player_id: "0xaaa2", player_name: "Scarface", final_score: 98000, registered: true, position: 2, multiplier: 1, token_id_type: "lootid", token_id: 2, season_version: "1", game_mode: "Ranked" },
  { game_id: 103, player_id: "0xaaa3", player_name: "Walter", final_score: 75000, registered: true, position: 3, multiplier: 1, token_id_type: "lootid", token_id: 3, season_version: "1", game_mode: "Ranked" },
  { game_id: 104, player_id: "0xaaa4", player_name: "Jesse", final_score: 52000, registered: true, position: 4, multiplier: 1, token_id_type: "lootid", token_id: 4, season_version: "1", game_mode: "Ranked" },
  { game_id: 105, player_id: "0xaaa5", player_name: "Gus", final_score: 43000, registered: true, position: 5, multiplier: 1, token_id_type: "lootid", token_id: 5, season_version: "1", game_mode: "Ranked" },
  { game_id: 106, player_id: MOCK_ADDRESS, player_name: "Player", final_score: 38000, registered: true, position: 6, multiplier: 1, token_id_type: "lootid", token_id: 6, season_version: "1", game_mode: "Ranked" },
  { game_id: 107, player_id: "0xaaa7", player_name: "Tuco", final_score: 28000, registered: true, position: 7, multiplier: 1, token_id_type: "lootid", token_id: 7, season_version: "1", game_mode: "Ranked" },
  { game_id: 108, player_id: "0xaaa8", player_name: "Mike", final_score: 21000, registered: true, position: 8, multiplier: 1, token_id_type: "lootid", token_id: 8, season_version: "1", game_mode: "Ranked" },
];

export const useRegisteredGamesBySeason = (_version: number) => ({
  registeredGames: mockLeaderboardGames,
  isFetched: true,
  isFetching: false,
  refetch: () => {},
});
