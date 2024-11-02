const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

const extendedColors = colors
extendedColors.red[700] = "#B7000B"

module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
      },
    },
    colors: extendedColors,
    nightwind: {
      colors: {
        red: {
          700: extendedColors.red[700],
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("nightwind"),
  ],
}