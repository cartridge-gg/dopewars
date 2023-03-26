// @ts-check

const { colors } = require("./colors");

/** @type {import('tailwindcss').Config['theme']} */
const theme = {
  // edit your tailwind theme here!
  // https://tailwindcss.com/docs/adding-custom-styles
  colors,
  container: {
    center: true,
  },
};

module.exports = {
  theme,
};
