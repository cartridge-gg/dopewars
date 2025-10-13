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

      // Skip fetch if query is empty
      if (!query || query.trim() === "") {
        setIsFetched(true);
        setIsFetching(false);
        return;
      }

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
    }, [query]);
  
    return { data, isFetched, isFetching, refetch };
  };