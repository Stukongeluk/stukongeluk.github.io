/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],  
  theme: {
    colors: {
      primary: colors.red
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
