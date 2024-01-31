import { cardStyle } from "../styles";

import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
});

const primaryStyle = definePartsStyle({
  // define the part you're going to style
  field: {
    border: 0,
    borderWidth: 0,
    
    ...cardStyle,

    bgColor: "transparent",
    borderRadius:"12px",
    overflow:"hidden",

    _focus: {
      bgColor: "neon.700",
    },
    _placeholder: {
      color: "neon.500",
    },
  },
});

export const Input = defineMultiStyleConfig({ baseStyle, variants: { primary: primaryStyle } });
