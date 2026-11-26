/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
delete colors['lightBlue']
delete colors['warmGray']
delete colors['trueGray']
delete colors['coolGray']
delete colors['blueGray']

/*
 * Japandi palette
 * - "gray" is remapped to a warm washi-paper → sumi-ink scale, so every existing
 *   gray utility (also on the project write-ups) turns warm automatically.
 * - The old accent hues (emerald, teal, blue, green) all point at one "accent"
 *   scale driven by CSS variables. By default it is oak/walnut wood; Super Saiyan
 *   mode swaps the variables to gold, so the whole site transforms at once.
 */
const accent = (shade) => `rgb(var(--accent-${shade}) / <alpha-value>)`;
const accentScale = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((s) => [s, accent(s)])
);

const paper = {
  50: '#FBF8F3',
  100: '#F5EFE6',
  200: '#EAE1D3',
  300: '#DACDBA',
  400: '#B8A992',
  500: '#776B5B',
  600: '#6D6254',
  700: '#51493F',
  800: '#38322B',
  900: '#27231E',
  950: '#1B1814',
};

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    colors: {
      ...colors,
      gray: paper,
      paper,
      accent: accentScale,
      emerald: accentScale,
      teal: accentScale,
      green: accentScale,
      blue: accentScale,
      primary: accentScale,
      moss: {
        300: '#B9C2A5',
        400: '#98A383',
        500: '#7A8665',
        600: '#5F6A4D',
        700: '#4A533C',
      },
      vermilion: {
        500: '#B4533A',
        600: '#9A4430',
      },
    },
    extend: {
      fontFamily: {
        serif: ['"Shippori Mincho"', '"Yu Mincho"', '"Hiragino Mincho ProN"', 'Georgia', 'serif'],
        sans: ['"Zen Kaku Gothic New"', '"Hiragino Sans"', '"Yu Gothic"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.7s cubic-bezier(.2,.7,.2,1) both',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
