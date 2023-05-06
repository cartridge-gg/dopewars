import BorderImage from "@/components/icons/BorderImage";
import { StyleProps } from "@chakra-ui/react";

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
  },
};

// applied layerStyles below and also chakra's Card component
export const cardStyle = {
  position: "relative",
  color: "neon.200",
  bgColor: "none",
  borderStyle: "solid",
  borderWidth: "2px",
  borderImageSlice: "4",
  borderImageWidth: "4px",
  borderImageSource: `url("data:image/svg+xml,${BorderImage("#11ED83")}")`,
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
    borderImageSource: `url("data:image/svg+xml,${BorderImage("#11ED83")}")`,
  },
  _active: {
    top: "2px",
    left: "2px",
    _before: {
      display: "none",
    },
  },
};

//layer styles
export const layerStyles = {
  card: cardStyle,
  rounded: {
    p: "6px",
    borderRadius: "6px",
    bgColor: "neon.800",
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
