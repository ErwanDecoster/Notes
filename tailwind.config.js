module.exports = {
  mode: 'jit',
  content: [
    "./assets/**/*.css",
    "./components/*.{vue,js}",
    "./components/**/*.{vue,js}",
    "./pages/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.{vue,js,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'lg-inverted': '0 -4px 15px -3px rgb(0 0 0 / 0.1), 0 -4px 6px -4px rgb(0 0 0 / 0.1);',
        'lg-dark-inverted': '0 -4px 15px -3px rgb(0 0 0 / 0.4), 0 -4px 6px -4px rgb(0 0 0 / 0.4);',
        'lg-dark': '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4);',
      }
    },
  },
  plugins: [],
}
