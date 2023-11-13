import BorderImage from "@/components/icons/BorderImage";
import BorderImagePixelated from "@/components/icons/BorderImagePixelated";
import PixelatedBorderImage from "@/components/icons/PixelatedBorderImage";

import { generatePixelBorderPath } from "@/utils/ui";

import colors from "./colors";

//global styles
export const styles = {
  global: {
    body: {
      height: "100vh",
      bgColor: "neon.900",
      color: "neon.200",
      letterSpacing: "0.04em",
      WebkitTapHighlightColor: "transparent",
      "scrollbar-width": "none"
    },
    "&::-webkit-scrollbar": {
      display: "none",
    },
    
  },
};

// applied layerStyles below and also chakra's Card component
export const cardStyle = {
  position: "relative",
  color: "neon.200",
  bgColor: "none",
  borderStyle: "solid",
  borderImageSlice: "6",
  borderImageWidth: "6px",
  borderImageSource: `url("data:image/svg+xml,${BorderImage({
    color: colors.neon["600"].toString(),
  })}")`,
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

export const headerStyles = {
  border: 0,
  bg: "neon.700",
  borderStyle: "solid",
  borderImageSlice: "8",
  borderImageWidth: "12px",
  borderRadius: ["16px", "0"],
  borderImageSource: [
    `url("data:image/svg+xml,${PixelatedBorderImage({
      color: colors.neon["700"].toString(),
    })}")`, 'none'
  ],
  clipPath: ["none", `polygon(${generatePixelBorderPath()})`],
}

export const headerButtonStyles = {
  ...headerStyles,
  _hover: {
    bg: "neon.600",
    borderImageSource: [
      `url("data:image/svg+xml,${PixelatedBorderImage({
        color: colors.neon["600"].toString(),
      })}")`, 'none'
    ]
  },
}

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
