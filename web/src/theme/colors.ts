export type ColorsType = {
  [key: string | number]: string | ColorsType;
};

const colors: ColorsType = {
  neon: {
    200: "#11ED83",
    300: "#16C973",
    500: "#157342",
    600: "#1F422A",
    700: "#202F20",
    800: "#1C291C",
    900: "#172217",
  },
  yellow: {
    400: "#FBCB4A",
  },
  black: "#000000",
  white: "#FFFFFF",
  whiteAlpha: {
    100: "rgba(255, 255, 255, 0.03)",
  },
};

export default colors;
