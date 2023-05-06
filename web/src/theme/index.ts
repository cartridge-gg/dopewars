// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";
import { styles, textStyles, layerStyles } from "./styles";
import { fonts } from "./fonts";
import * as Components from "./components";
import colors from "./colors";
import breakpoints from "./breakpoints";

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  fonts,
  colors,
  styles,
  textStyles,
  layerStyles,
  breakpoints,
  components: {
    ...Components,
  },
});

export default theme;
