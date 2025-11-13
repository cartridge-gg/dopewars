import { useEffect, useState } from "react";
import { useDojoContext } from "./useDojoContext";

export const useSql = (query: string) => {
  const {
    chains: { selectedChain },
  } = useDojoContext();
  const sqlEndpoint = selectedChain.toriiUrl.replace("graphql", "sql");

  const [data, setData] = useState<any>();
  const [isFetched, setIsFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const refetch = async () => {
    setIsFetched(false);
    setIsFetching(false);
    setData([]);

    try {
      setIsFetching(true);

      const request = `${sqlEndpoint}?query=${encodeURI(query)}`;
      const res = await fetch(request);
      const json = await res.json();
      setData(json);
      setIsFetched(true);
    } catch (e: any) {
      setData([]);

      setIsFetched(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return { data, isFetched, isFetching, refetch };
};
