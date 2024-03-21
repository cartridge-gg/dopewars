import { useDojoContext } from "@/dojo/hooks";
import { useCallback } from "react";


export const useFetchData = <TData, TVariables>(query: string): ((variables?: TVariables) => Promise<TData>) => {
  const {
    chains: {
      selectedChain: { toriiUrl },
    },
  } = useDojoContext();

  return useCallback(
    async (variables?: TVariables) => {
      console.log("fetcher", toriiUrl);
      const res = await fetch(toriiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const json = await res.json();

      if (json.errors) {
        throw new Error(JSON.stringify(json.errors));
      }

      return json.data;
    },
    [toriiUrl, query],
  );
};
