import type { ComponentMultiStyleConfig } from "@chakra-ui/theme";

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
    },
    overlay: {},
    footer: {},
  },
};
