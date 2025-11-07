import { cardAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import BorderImage from "@/components/icons/PressableBorderImage";
import { cardStyle, cardPixelatedStyle } from "../styles";
import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  container: {
    ...cardStyle,
  },
  header: {
    textAlign: "center",
  },
  body: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
  footer: {},
});

const variants = {
  primary: definePartsStyle({
    header: {
      py: "6px",
    },
    body: {
      py: "6px",
    },
    footer: {
      px: "20px",
      py: "12px",
    },
  }),
  pixelated: definePartsStyle({
    container: {
      ...cardPixelatedStyle({}),
    },
    // body:{
    //   bg:"neon.700"
    // }
  }),
};

export const Card = defineMultiStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: "primary",
  },
});
