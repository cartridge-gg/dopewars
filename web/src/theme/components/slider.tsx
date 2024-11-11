import { ComponentStyleConfig } from "@chakra-ui/react";
import { cardPixelatedStyle, cardPixelatedStyleOutset } from "../styles";

import { sliderAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

import { generatePixelBorderPath } from "@/utils/ui";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(sliderAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    // this will style the Slider component
  },
  track: {
    // this will style the SliderTrack component
    height: "16px",
    //...cardPixelatedStyle({radius:2}),
    ...cardPixelatedStyleOutset({ borderimagewidth: 8 }),
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

const small = definePartsStyle({
  track: {
    // this will style the SliderTrack component
    height: "5px",
    borderImage: "none",
    "border-image-width": 0,
  },
  filledTrack: {
    // this will style the SliderFilledTrack component
    bg: "neon.500",
    height: "5px",
    borderRadius: 0,
    borderImage: "none",
    "border-image-width": 0,
    // clipPath: `polygon(${generatePixelBorderPath(2, 2)})`,
  },
  thumb: {
    bg: "neon.400",
    borderRadius: 0,
    clipPath: `polygon(${generatePixelBorderPath(2, 2)})`,
  },
  mark: {
    color: "neon.700",
  },
});

// export the base styles in the component theme
export const Slider = defineMultiStyleConfig({ baseStyle, variants: { small } });
