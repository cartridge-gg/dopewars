import { useBreakpointValue } from "@chakra-ui/react";

// remove this once we override breakpoints in chakra
export const breakpoint = (mobile: string, desktop: string): string[] => [
  mobile,
  mobile,
  mobile,
  desktop,
];

export const IsMobile = () => useBreakpointValue([true, true, true, false]);
