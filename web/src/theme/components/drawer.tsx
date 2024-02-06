import { drawerAnatomy } from "@chakra-ui/anatomy";
import { ComponentMultiStyleConfig } from "@chakra-ui/react";

export const Drawer: ComponentMultiStyleConfig = {
  parts: drawerAnatomy,
  defaultProps: {
    size: "sm",
  },
  baseStyle: {
    dialog: {
      pointerEvents: "auto",
      backgroundColor:"neon.900"
    },
    dialogContainer: {
      pointerEvents: "none",
    },
  },
};
