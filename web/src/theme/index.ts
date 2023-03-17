// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";
import * as Components from "./components";

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors: {
    brand: "#3523FE",
  },
  fonts: {
    body: "ChicagoFLF",
  },
  styles: {
    global: {
        body: {
            background: "gray.400",
            fontSize: "sm",
            fontWeight: "500",
            backgroundImage: "url('/RYO_Background.png')",
        },
    },
  },
  components: {
    ...Components,
  },
});

export default theme;
