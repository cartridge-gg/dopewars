import type { ComponentMultiStyleConfig } from "@chakra-ui/react";

export const Accordion: ComponentMultiStyleConfig = {
  parts: ["root", "container", "button", "panel", "icon"],
  baseStyle: {
    root: {
      bgColor: "gray.900",
      layerStyle: "card",
      borderColor: "black",
      p: "0",
    },
    container: {
      px: "12px",
      borderTop: "none",
      borderBottom: "1px solid black",
      _last: {
        borderBottom: "none",
      },
    },
    panel: {},
    button: {
      px: "0",
      fontSize: "14px",
      gap: "6px",
    },
  },
  variants: {},
};
