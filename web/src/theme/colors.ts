export type ColorsType = {
  [key: string | number]: string | ColorsType;
};

const colors: ColorsType = {
  neon: {
    200: "#11ED83",
    300: "#16C973",
    400: "#11ED83",
    500: "#157342",
    600: "#1F422A",
    700: "#202F20",
    800: "#1C291C",
    900: "#172217",
  },
  neon900Alpha: "#424b42DD",
  yellow: {
    400: "#FBCB4A",
    500: "#8a7830",
  },
  red: "#FB744A",
  black: "#000000",
  gray: "#231F20",
  white: "#FFFFFF",
  whiteAlpha: {
    100: "rgba(255, 255, 255, 0.03)",
  },
  dojoRed: "#ff2f42",
  cartridgeYellow: "#FFC52A",
};

export default colors;
