// Stubs for remaining hooks that make network calls

export const useActiveGamesBySeason = (_version: number) => ({
  activeGames: [],
  isFetched: true,
  isFetching: false,
  refetch: () => {},
});

export const useGameById = () => ({
  game: null,
  isFetched: true,
});

export const useHallOfFame = () => ({
  hallOfFame: [],
  isFetched: true,
  refetch: () => {},
});

export const useTokenBalance = () => ({
  balance: BigInt("10000000000000000000000"),
  isPending: false,
  refetch: () => {},
});

export const useClaimable = () => ({
  claimable: [],
  isFetched: true,
  refetch: () => {},
});

export const useControllerUsername = () => ({
  username: "Player",
});

export const useGamesByPlayer = () => ({
  games: [],
  isFetched: true,
  refetch: () => {},
});
