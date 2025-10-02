import { useDojoContext } from "./useDojoContext";
import { useCallback, useEffect, useState } from "react";

export const useBlockTimestamp = () => {
  const [timestamp, setTimestamp] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const {
    clients: { rpcProvider }
  } = useDojoContext();

  const fetchBlockTimestamp = useCallback(async () => {
    try {
      setIsLoading(true);
      const block = await rpcProvider.getBlock('latest');
      // Convert to milliseconds for consistency with Date.now()
      const blockTimestamp = block.timestamp * 1000;
      setTimestamp(blockTimestamp);
      console.log("Block timestamp:", block.timestamp, "-> Converted:", blockTimestamp, "-> Date:", new Date(blockTimestamp));
    } catch (error) {
      console.error('Failed to fetch block timestamp:', error);
      setTimestamp(Date.now());
    } finally {
      setIsLoading(false);
    }
  }, [rpcProvider]);

  useEffect(() => {
    fetchBlockTimestamp();
  }, [rpcProvider, fetchBlockTimestamp]);

  return { timestamp, isLoading, refetch: fetchBlockTimestamp };
};