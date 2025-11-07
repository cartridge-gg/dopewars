import { drawerAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  dialog: {
    pointerEvents: "auto",
    backgroundColor: "neon.800",
  },
  dialogContainer: {
    pointerEvents: "none",
  },
});

export const Drawer = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    size: "sm",
  },
});
