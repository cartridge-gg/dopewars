// @ts-check

const { theme } = require("app/theme");

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./App.tsx", "../../packages/**/*.{js,jsx,ts,tsx}"],
  theme: {
    ...theme,
  },
  plugins: [],
};
