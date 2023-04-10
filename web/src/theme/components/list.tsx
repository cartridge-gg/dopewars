import type { ComponentMultiStyleConfig } from "@chakra-ui/theme";

export const List: ComponentMultiStyleConfig = {
  parts: ["container", "item", "icon"],
  baseStyle: {
    container: {
      layerStyle: "card",
      p: "0",
    },
    item: {
      py: "12px",
      px: "18px",
      borderBottom: "2px solid",
      borderColor: "inherit",
      _last: {
        borderBottom: "none",
      },
    },
  },
};
