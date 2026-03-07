export const useSeasons = () => ({
  seasons: [
    {
      season: {
        version: 1,
        next_version_timestamp: Math.floor(Date.now() / 1000) + 86400 * 3,
        season_time_limit: 86400,
        paper_balance: 50000,
        paper_fee: 100,
      },
      sortedList: { list_id: 1, size: 8, process_size: 8, process_max_size: 8, processed: false },
    },
    {
      season: {
        version: 2,
        next_version_timestamp: Math.floor(Date.now() / 1000) - 86400,
        season_time_limit: 86400,
        paper_balance: 120000,
        paper_fee: 100,
      },
      sortedList: { list_id: 2, size: 42, process_size: 42, process_max_size: 42, processed: true },
    },
  ],
  isFetched: true,
  refetch: () => {},
});

export type SeasonInfos = any;
