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
    800: "#202221",
    900: "#141011",
  },
  blue: "#3523FE",
  red: "#FF2828",
  green: "#22B617",
  pink: "#D800D8",
  black: "#000000",
  white: "#FFFFFF",
};

export default colors;
