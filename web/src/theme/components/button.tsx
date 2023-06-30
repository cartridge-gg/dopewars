import BorderImage from "@/components/icons/BorderImage";
import { generatePixelBorderPath } from "@/utils/ui";
import { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
  defaultProps: {
    variant: "primary",
  },
  baseStyle: {
    fontWeight: "400",
    textTransform: "uppercase",
    position: "relative",
    borderStyle: "solid",
    borderWidth: "2px",
    borderImageSlice: "4",
    borderImageWidth: "4px",
    px: "40px",
    gap: "10px",
    bgColor: "neon.900",
    transition: "none",
    _active: {
      top: "2px",
      left: "2px",
    },
    _disabled: {
      pointerEvents: "none",
    },
  },
  variants: {
    primary: {
      color: "neon.200",
      borderImageSource: `url("data:image/svg+xml,${BorderImage({
        color: "#11ED83",
        isPressed: false,
      })}")`,
      _hover: {
        color: "neon.300",
        borderImageSource: `url("data:image/svg+xml,${BorderImage({
          color: "#16C973",
          isPressed: false,
        })}")`,
      },
      _active: {
        borderImageSource: `url("data:image/svg+xml,${BorderImage({
          color: "#16C973",
          isPressed: true,
        })}")`,
      },
    },
    pixelated: {
      border: 0,
      bg: "neon.700",
      lineHeight: "1em",
      clipPath: `polygon(${generatePixelBorderPath()})`,
      _hover: {
        bg: "neon.600",
      },
    },
    default: {},
  },
};
