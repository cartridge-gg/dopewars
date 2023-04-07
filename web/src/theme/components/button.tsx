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
    gap: "8px",
  },
  variants: {
    primary: {
      backgroundColor: "brand",
      color: "white",
      textShadow: "1px 1px 0px rgba(0, 0, 0, 0.66)",
      border: "2px solid #000000",
      borderRadius: "4px",
      padding: "8px 12px",
      boxShadow:
        "inset -1px -1px 0px rgba(0, 0, 0, 0.25), inset 1px 1px 0px rgba(255, 255, 255, 0.25)",
      fontSize: "14px",
      lineHeight: "1em",
      fontWeight: "400",
      _hover: {
        backgroundColor: "#000",
        color: "#fff",
        textDecoration: "none",
      },
    },
    secondary: {
      backgroundColor: "gray.100",
      color: "black",
      border: "2px solid #000000",
      borderRadius: "4px",
      padding: "8px 12px",
      boxShadow:
        "inset -1px -1px 0px rgba(0, 0, 0, 0.25), inset 1px 1px 0px rgba(255, 255, 255, 0.25)",
      fontSize: "14px",
      lineHeight: "1em",
      fontWeight: "400",
      _hover: {
        backgroundColor: "#000",
        color: "#fff",
        textDecoration: "none",
      },
    },
  },
};
