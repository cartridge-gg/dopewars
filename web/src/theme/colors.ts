export type ColorsType = {
  [key: string | number]: string | ColorsType;
};

const colors: ColorsType = {
  brand: "#3523FE",
  gray: {
    100: "#EDEFEE",
    400: "#878E8E",
    500: "#747A7C",
    600: "#434345",
    700: "#313332",
    800: "#202221",
    900: "#141515",
  },
  blue: {
    100: "#3523FE",
    200: "#66A3FF",
  },
  red: "#FF2828",
  green: "#22B617",
  pink: "#D800D8",
  black: "#000000",
  white: "#FFFFFF",
  whiteAlpha: {
    100: "rgba(255, 255, 255, 0.03)",
  },
};

export default colors;
