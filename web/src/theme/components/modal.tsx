import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { cardPixelatedStyle } from "../styles";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  dialog: {
    mx: "16px",
    bgColor: "neon.900",
    ...cardPixelatedStyle({}),
  },
  footer: {},
  header: {
    fontWeight: "normal",
  },
});

export const Modal = defineMultiStyleConfig({ baseStyle });
