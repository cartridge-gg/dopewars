import { ComponentStyleConfig } from "@chakra-ui/react";
import { cardPixelatedStyle } from "../styles";

import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const baseStyle = definePartsStyle({
  root: {},
  tab: {
    color: "neon.300",
    _selected: {
      color: "neon.200",
      ...cardPixelatedStyle({ radius: 2 }),
    },
  },
  tablist: {},
  tabpanels: {
    mt: "20px",
    minH: "150px",
  },
  tabpanel: {},
});
// export the base styles in the component theme
export const Tabs = defineMultiStyleConfig({ baseStyle });
