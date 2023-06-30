import { ComponentStyleConfig } from "@chakra-ui/react";
import { cardPixelatedStyle, cardPixelatedStyleOutset } from "../styles";

import { sliderAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

import { generatePixelBorderPath } from "@/utils/ui";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(sliderAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    // this will style the Slider component
  },
  track: {
    // this will style the SliderTrack component
    height: "16px",
    //...cardPixelatedStyle({radius:2}),
    ...cardPixelatedStyleOutset({ borderImageWidth: 8 }),
  },
  thumb: {
    // this will style the SliderThumb component
  },
  filledTrack: {
    // this will style the SliderFilledTrack component
    bg: "neon.200",
    height: "16px",
    borderRadius: 0,
    clipPath: `polygon(${generatePixelBorderPath(2, 2)})`,
  },
  mark: {
    // this will style the SliderMark component
  },
});
// export the base styles in the component theme
export const Slider = defineMultiStyleConfig({ baseStyle });
