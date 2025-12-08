import { popoverAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { cardPixelatedStyle } from "../styles";
const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);
const baseStyle = definePartsStyle({
  // define the part you're going to style
  body: {
    bg: "neon.700", // change the background of the body to gray.800
  },
  content: {
    ...cardPixelatedStyle({}),
    bg: "neon.700",
    padding: 0, // change the padding of the content
  },
  popper: {
    cursor: "pointer",
  },
});
export const Popover = defineMultiStyleConfig({ baseStyle });
