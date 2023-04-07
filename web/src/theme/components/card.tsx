import type { ComponentMultiStyleConfig } from "@chakra-ui/theme";

export const Card: ComponentMultiStyleConfig = {
  parts: ["container", "header", "body", "footer"],
  baseStyle: {
    container: {
      borderWidth: "2px",
      borderRadius: "4px",
      borderColor: "gray.900",
      bgColor: "gray.800",
    },
    header: {
      display: "flex",
      gap: "6px",
      p: "12px",
    },
    body: {
      p: "12px",
    },
    footer: {
      p: "12px",
    },
  },
};
