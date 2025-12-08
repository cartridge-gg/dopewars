import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { formatUnits, parseUnits } from "viem";

interface PaperPriceContextType {
  usdPerPaper: number | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const PaperPriceContext = createContext<PaperPriceContextType | null>(null);

const CACHE_DURATION = 30000; // 30 seconds

// PAPER token info
const PAPER_ADDRESS = "0x0410466536b5ae074f7fea81e5533b8134a9fa08b3dd077dd9db08f64997d113";
const PAPER_DECIMALS = 18;
// USDC token info
const USDC_ADDRESS = "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
const USDC_DECIMALS = 6;

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
      // Fetch PAPER to USDC conversion rate using 1000 PAPER
      const scaledAmount = parseUnits("1000", PAPER_DECIMALS);
      const response = await fetch(
        `https://starknet-mainnet-quoter-api.ekubo.org/${scaledAmount}/${PAPER_ADDRESS}/${USDC_ADDRESS}`,
      );
      const data = await response.json();
      const amountOut = Number(formatUnits(data?.total_calculated?.toString() ?? "0", USDC_DECIMALS)) || 0;
      const price = amountOut / 1000;
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
