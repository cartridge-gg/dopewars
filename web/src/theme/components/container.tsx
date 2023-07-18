import type { ComponentStyleConfig } from "@chakra-ui/theme";

export const Container: ComponentStyleConfig = {
  baseStyle: {
    display: "flex",
    maxW: "1400px",
    h: "full",
    py: ["60px", "10%"],
    px: "24px",
    gap: ["0", "100px"],
    flexDirection: ["column", "row"],
  },
};
