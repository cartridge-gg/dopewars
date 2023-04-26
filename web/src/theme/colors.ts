export type ColorsType = {
  [key: string | number]: string | ColorsType;
};

const colors: ColorsType = {
  neon: {
    200: "#11ED83",
    600: "#157342",
    700: "#1F422A",
    800: "#202F20",
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
