import { useToken } from "@chakra-ui/react";
import BorderImage from "@/components/icons/BorderImage";
import BorderImagePixelated from "@/components/icons/BorderImagePixelated";

import { generatePixelBorderPath } from "@/utils/ui";

import colors from "./colors";

const scrollbarStyle = {
  ".scrollbar-view": {
    overflow: "auto !important",
    marginRight: "-1px !important",
    marginBottom: "-1px !important",
    paddingRight: "10px",
    paddingBottom: "10px",
  },
  ".scrollbar-container": {
    height: "100%",
    width: "100%",

  },
  ".scrollbar-vertical": {
    height: '100%',
    width: "16px !important",
    top: 0,
    right: 0,
    bg: "neon.900",
    border: "solid 2px",
    borderColor: "neon.300",
    cursor: "pointer"

  },
  ".scrollbar-horizontal": {
    width: '100%',
    height: "16px  !important",
    bottom: 0,
    left: 0,
    bg: "neon.900",
    border: "solid 2px",
    borderColor: "neon.300",
    cursor: "pointer"

  },
  ".thumb-vertical": {
    bg: "neon.300",
  },
  ".thumb-horizontal": {
    bg: "neon.300",

  },
}

//global styles
export const styles = {
  global: {
    body: {
      height: "100vh",
      bgColor: "neon.900",
      color: "neon.200",
      letterSpacing: "0.04em",
      WebkitTapHighlightColor: "transparent",
    },
    ...scrollbarStyle,
  },
};


// applied layerStyles below and also chakra's Card component
export const cardStyle = {
  position: "relative",
  marginRight: "2px",
  color: "neon.200",
  bgColor: "none",
  borderStyle: "solid",
  borderWidth: "2px",
  borderImageSlice: "4",
  borderImageWidth: "4px",
  borderImageSource: `url("data:image/svg+xml,${BorderImage({
    color: colors.neon["200"].toString(),
    isPressed: false,
  })}")`,
  _hover: {
    color: "neon.300",
    borderImageSource: `url("data:image/svg+xml,${BorderImage({
      color: colors.neon["300"].toString(),
      isPressed: false,
    })}")`,
  },
  _active: {
    top: "2px",
    left: "2px",
    borderImageSource: `url("data:image/svg+xml,${BorderImage({
      color: colors.neon["300"].toString(),
      isPressed: true,
    })}")`,
  },
};

// use clipPath to "cut" corners
export const cardPixelatedStyle = ({
  color = colors.neon["700"].toString(),
  pixelSize = 4,
  radius = 4,
}: {
  color?: string;
  pixelSize?: number;
  radius?: number;
}) => ({
  w: "full",
  bg: color,
  borderWidth: "0",
  borderRadius: "0",

  borderImageSource: "none",
  _hover: {
    borderImageSource: `none`,
  },
  _active: {
    top: 0,
    left: 0,
    borderImageSource: `none`,
  },
  clipPath: `polygon(${generatePixelBorderPath(radius, pixelSize)})`,
});

// use borderImage & borderImageOutset to display border with outset
export const cardPixelatedStyleOutset = ({
  color = colors.neon["700"].toString(),
  borderImageWidth = 8,
}: {
  color?: string;
  borderImageWidth?: number;
}) => ({
  w: "full",
  bg: color,
  borderWidth: "0",
  borderRadius: "0",
  borderImageWidth: `${borderImageWidth}px`,
  borderImageOutset: `${borderImageWidth}px`,
  borderImageSlice: 7,

  borderImageSource: `url("data:image/svg+xml,${BorderImagePixelated({
    color,
  })}")`,

  _hover: {
    borderImageSource: `url("data:image/svg+xml,${BorderImagePixelated({
      color,
    })}")`,
  },
  _active: {
    top: 0,
    left: 0,
    borderImageSource: `url("data:image/svg+xml,${BorderImagePixelated({
      color,
    })}")`,
  },
});

//layer styles
export const layerStyles = {
  card: cardStyle,
  rounded: {
    p: "6px",
    borderRadius: "6px",
    bgColor: "neon.700",
  },
  fill: {
    position: "absolute",
    top: "0",
    left: "0",
    boxSize: "full",
  },
};

//text styles
export const textStyles = {
  "upper-bold": {
    fontWeight: "700",
    textTransform: "uppercase",
  },
  subheading: {
    textTransform: "uppercase",
    fontFamily: "broken-console",
    letterSpacing: "0.25em",
  },
};
