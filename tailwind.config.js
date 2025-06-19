module.exports = {
  theme: {
    extend: {
      colors: {
        dark: '#242424',
        innohassle: '#9747FF',
        subtle: '#737171',
        highlight: '#6EC7F4',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif']
      }
    },
  },
  variants: {
    extend: {},
  },
  content: ['./src/client/**/*.{js,jsx,ts,tsx}'],
};
