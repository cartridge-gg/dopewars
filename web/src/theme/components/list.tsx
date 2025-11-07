import { listAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  container: {
    marginInlineStart: "unset",
    WebkitMarginStart: "unset",
    listStylePosition: "inside",
    p: "0",
  },
  item: {
    pt: "18px",
    pb: "6px",
    px: "0",
  },
});

const variants = {
  underline: definePartsStyle({
    item: {
      listStyleType: "none",
      borderBottom: "2px solid",
      borderColor: "neon.200",
    },
  }),
  dotted: definePartsStyle({
    item: {
      listStyleType: "none",
      pt: "9px",
      pb: "9px",
    },
  }),
};

export const List = defineMultiStyleConfig({ baseStyle, variants });
