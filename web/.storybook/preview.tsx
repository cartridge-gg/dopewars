import React from "react";
import type { Preview } from "@storybook/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../src/theme";
import Fonts from "../src/theme/fonts";
import GlobalStyles from "../src/theme/global";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: {
        desktop: {
          name: "Desktop",
          styles: { width: "1280px", height: "800px" },
        },
        mobile: {
          name: "Mobile",
          styles: { width: "390px", height: "844px" },
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <ChakraProvider theme={theme}>
        <Fonts />
        <GlobalStyles />
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default preview;
