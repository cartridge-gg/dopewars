// Shared cache for PAPER price (USD per PAPER)
// This ensures all components use the same cached price and don't make excessive API calls

interface PriceCache {
  price: number;
  timestamp: number;
}

let cache: PriceCache | null = null;
const CACHE_DURATION = 30000; // 30 seconds in milliseconds

export const getPaperPriceCache = (): PriceCache | null => {
  if (!cache) return null;

  const now = Date.now();
  if (now - cache.timestamp >= CACHE_DURATION) {
    // Cache expired
    return null;
  }

  return cache;
};

export const setPaperPriceCache = (price: number): void => {
  cache = {
    price,
    timestamp: Date.now(),
  };
};

export const PRICE_CACHE_DURATION = CACHE_DURATION;
