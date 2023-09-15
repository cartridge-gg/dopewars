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
      bgColor: "neon.900",
      ...cardPixelatedStyle({}),
    },
    overlay: {},
    footer: {},
    header: {
      fontWeight: "normal"
    }
  },
};
