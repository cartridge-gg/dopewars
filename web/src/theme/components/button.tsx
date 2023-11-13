import BorderImage from "@/components/icons/PressableBorderImage";
import { generatePixelBorderPath } from "@/utils/ui";
import { ComponentStyleConfig } from "@chakra-ui/react";

import colors from "../colors";

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
        borderImageSource: `url("data:image/svg+xml,${BorderImage({
          color: colors.neon["300"].toString(),
          isPressed: true,
        })}")`,
      },
    },
    selectable: {
      color: "neon.200",
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
        color: colors.yellow["400"].toString(),
        borderImageSource: `url("data:image/svg+xml,${BorderImage({
          color: colors.yellow["400"].toString(),
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
