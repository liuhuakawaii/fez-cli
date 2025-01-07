/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': "1024px",
        'sm': '1280px',
        'xmd': '1366px',
        'md': '1400px',
        'lg': '1600px',
        'xl': '1920px',
        '2xl': '2560px',
        '3xl': '3200px',
      },
    },
  },
  plugins: [],
}
