import { drawerAnatomy } from "@chakra-ui/anatomy";
import { ComponentMultiStyleConfig } from "@chakra-ui/react";

export const Drawer: ComponentMultiStyleConfig = {
  // @ts-ignore
  parts: drawerAnatomy,
  defaultProps: {
    size: "sm",
  },
  baseStyle: {
    dialog: {
      pointerEvents: "auto",
      backgroundColor: "neon.800",
    },
    dialogContainer: {
      pointerEvents: "none",
    },
  },
};
