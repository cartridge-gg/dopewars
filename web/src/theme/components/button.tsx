import { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
  defaultProps: {
    variant: "primary",
  },
  baseStyle: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    position: "relative",
    borderWidth: "2px",
    borderColor: "gray.900",
    borderRadius: "4px",
    padding: "8px 12px",
    gap: "8px",
    boxShadow:
      "inset -1px -1px 0px rgba(0, 0, 0, 0.25), inset 1px 1px 0px rgba(255, 255, 255, 0.25)",
    _hover: {
      backgroundColor: "#000",
      color: "#fff",
      textDecoration: "none",
    },
  },
  variants: {
    primary: {
      color: "white",
      fontSize: "14px",
      backgroundColor: "brand",
    },
    secondary: {
      color: "black",
      fontSize: "14px",
      backgroundColor: "gray.100",
    },
    default: {
      backgroundColor: "gray.600",
    },
  },
};
