import type { ComponentMultiStyleConfig } from "@chakra-ui/react";
import { cardPixelatedStyle } from "../styles";

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
      mx: "16px",
      bgColor: "neon.900",
      ...cardPixelatedStyle({}),
    },
    footer: {},
    header: {
      fontWeight: "normal",
    },
  },
};
