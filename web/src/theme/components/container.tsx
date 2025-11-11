import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Container: ComponentStyleConfig = {
  baseStyle: {
    h: "100%",
    p: "16px",
    my: ["0", "auto"],
    minH: "0",
    maxH: ["100%", "800px"],
    maxW: "1200px",
    display: "flex",
    gap: ["10px", "100px"],
    flexDirection: ["column", "row"],
  },
};
