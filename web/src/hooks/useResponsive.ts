import { useState, useEffect } from "react";

// Main breakpoint at 992px (62em) - matches Chakra theme
const BREAKPOINT = 992;

/**
 * Hook to detect if the current viewport is mobile (below 992px)
 * Replaces Chakra's useBreakpointValue([true, false])
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * Hook to get responsive values based on viewport
 * Replaces Chakra's useBreakpointValue([mobile, desktop])
 *
 * @param values - Tuple of [mobileValue, desktopValue]
 * @returns The appropriate value for current viewport
 */
export function useResponsiveValue<T>(values: [T, T]): T {
  const isMobile = useIsMobile();
  return isMobile ? values[0] : values[1];
}

/**
 * Alternative IsMobile function that works like the original
 * Can be used directly in components: const isMobile = IsMobile();
 */
export const IsMobile = () => useIsMobile();
