import BorderImage from "@/components/icons/BorderImage";
import { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
  defaultProps: {
    variant: "primary",
  },
  baseStyle: {
    textTransform: "uppercase",
    position: "relative",
    borderStyle: "solid",
    borderWidth: "2px",
    borderImageSlice: "4",
    borderImageWidth: "4px",
    _before: {
      content: '""',
      position: "absolute",
      bottom: "-4px",
      right: "-4px",
      height: "100%",
      width: "100%",
      borderStyle: "solid",
      borderWidth: "2px",
      borderImageSlice: "4",
      borderImageWidth: "0 6px 6px 0",
    },
    _active: {
      top: "2px",
      left: "2px",
      _before: {
        display: "none",
      },
    },
    _disabled: {
      pointerEvents: "none",
    },
  },
  variants: {
    primary: {
      borderImageSource: `url("data:image/svg+xml,${BorderImage("11ED83")}")`,
      _before: {
        borderImageSource: `url("data:image/svg+xml,${BorderImage("11ED83")}")`,
      },
    },
    secondary: {
      color: "neon.600",
      borderImageSource: `url("data:image/svg+xml,${BorderImage("157342")}")`,
      _before: {
        borderImageSource: `url("data:image/svg+xml,${BorderImage("157342")}")`,
      },
    },
    default: {},
  },
};
