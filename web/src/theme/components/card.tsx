import type { ComponentMultiStyleConfig } from "@chakra-ui/theme";

export const Card: ComponentMultiStyleConfig = {
  parts: ["container", "header", "body", "footer"],
  baseStyle: {
    container: {
      borderWidth: "2px",
      borderRadius: "4px",
      borderColor: "gray.900",
      bgColor: "gray.800",
      color: "white",
    },
    header: {
      color: "white",
      fontSize: "22px",
      display: "flex",
      gap: "6px",
      p: "12px",
    },
    body: {
      p: "12px",
      "::-webkit-scrollbar": {
        display: "none",
      },
    },
    footer: {
      gap: "6px",
      p: "12px",
    },
  },
};
