import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { cardPixelatedStyle } from "../styles";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tabsAnatomy.keys);

const baseStyle = definePartsStyle({
  root: {},
  tab: {
    color: "neon.300",
    ...cardPixelatedStyle({ radius: 2 }),
    bg: "transparent",
    textTransform: "uppercase",
    borderBottom: "solid 2px",
    borderColor: "neon.700",

    _selected: {
      color: "neon.200",
      bg: "neon.700",
      borderColor: "neon.700",
    },
  },
  tablist: {
    gap: 4,
  },
  tabpanels: {
    mt: "20px",
    minH: "150px",
  },
  tabpanel: {},
});
// export the base styles in the component theme
export const Tabs = defineMultiStyleConfig({ baseStyle });
