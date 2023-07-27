import { popoverAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  body: {
    bg: "neon.800",
  },
  content: {
    border: 0,
    // borderColor:'neon.500',
  },
  arrow: {
    bg: "neon.300 !important",
    boxShadow: "none",
  },
});
export const Popover = defineMultiStyleConfig({ baseStyle });
