import { accordionAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  root: {
    bgColor: "gray.900",
    layerStyle: "card",
    borderColor: "black",
    p: "0",
  },
  container: {
    px: "12px",
    borderTop: "none",
    borderBottom: "1px solid black",
    _last: {
      borderBottom: "none",
    },
  },
  panel: {},
  button: {
    px: "0",
    fontSize: "14px",
    gap: "6px",
  },
});

export const Accordion = defineMultiStyleConfig({ baseStyle });
