import type { ComponentMultiStyleConfig } from "@chakra-ui/theme";
import { cardStyle, cardPixelatedStyle } from "../styles";

export const Modal: ComponentMultiStyleConfig = {
  parts: [
    "overlay",
    "dialogContainer",
    "dialog",
    "header",
    "closeButton",
    "body",
    "footer",
  ],
  baseStyle: {
    dialog: {
      mx:"16px",
      bgColor: "neon.900",
      ...cardPixelatedStyle({}),
    },
    overlay: {
      bgColor: ["neon900Alpha", "blackAlpha.600"]
    },
    footer: {},
    header: {
      fontWeight: "normal"
    }
  },
};
