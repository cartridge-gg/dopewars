// Mock implementations for hooks that require providers not available in Storybook

// Mock usePaperPrice
export const usePaperPrice = () => ({
  usdPerPaper: 0.01,
  isLoading: false,
  error: null,
  refetch: () => {},
});

// Mock PaperPriceProvider - just renders children
export const PaperPriceProvider = ({ children }: { children: any }) => children;
