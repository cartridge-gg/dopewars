import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { getSwapQuote, PAPER, USDC } from "@/hooks/useEkubo";

interface PaperPriceContextType {
  usdPerPaper: number | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const PaperPriceContext = createContext<PaperPriceContextType | null>(null);

const CACHE_DURATION = 30000; // 30 seconds

export const PaperPriceProvider = ({ children }: { children: ReactNode }) => {
  const [usdPerPaper, setUsdPerPaper] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lastFetchTimeRef = useRef(0);

  const fetchPrice = useCallback(async (force = false) => {
    const now = Date.now();

    // Skip if cache is still valid (unless forced)
    if (!force && usdPerPaper !== null && now - lastFetchTimeRef.current < CACHE_DURATION) {
      return;
    }

    // Prevent concurrent fetches
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const quote = await getSwapQuote(1000, PAPER, USDC, false);
      const price = quote.amountOut / 1000;
      setUsdPerPaper(price);
      lastFetchTimeRef.current = Date.now();
    } catch (e) {
      console.error("Failed to fetch PAPER price:", e);
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [usdPerPaper, isLoading]);

  // Fetch on mount
  useEffect(() => {
    fetchPrice();
  }, []);

  // Auto-refresh every 30 seconds while mounted
  useEffect(() => {
    const interval = setInterval(() => fetchPrice(), CACHE_DURATION);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return (
    <PaperPriceContext.Provider value={{ usdPerPaper, isLoading, error, refetch: () => fetchPrice(true) }}>
      {children}
    </PaperPriceContext.Provider>
  );
};

export const usePaperPrice = () => {
  const context = useContext(PaperPriceContext);
  if (!context) {
    throw new Error("usePaperPrice must be used within a PaperPriceProvider");
  }
  return context;
};
