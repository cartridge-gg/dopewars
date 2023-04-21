import { ComponentStyleConfig } from "@chakra-ui/react";
const borderImg = (color: string) => {
  return `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><path d='M2 2h2v2H2zM4 0h2v2H4zM10 4h2v2h-2zM0 4h2v2H0zM6 0h2v2H6zM8 2h2v2H8zM8 8h2v2H8zM6 10h2v2H6zM0 6h2v2H0zM10 6h2v2h-2zM4 10h2v2H4zM2 8h2v2H2z' fill='%23${color}' /></svg>`;
};

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
      borderImageSource: `url("data:image/svg+xml,${borderImg("11ED83")}")`,
      _before: {
        borderImageSource: `url("data:image/svg+xml,${borderImg("11ED83")}")`,
      },
    },
    secondary: {
      color: "neon.600",
      borderImageSource: `url("data:image/svg+xml,${borderImg("157342")}")`,
      _before: {
        borderImageSource: `url("data:image/svg+xml,${borderImg("157342")}")`,
      },
    },
    default: {},
  },
};
