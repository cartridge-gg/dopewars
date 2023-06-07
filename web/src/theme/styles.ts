import BorderImage from "@/components/icons/BorderImage";

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
    top: "2px",
    left: "2px",
    borderImageSource: `url("data:image/svg+xml,${BorderImage({
      color: "#16C973",
      isPressed: true,
    })}")`,
  },
};

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
