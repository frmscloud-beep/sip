/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cafe-beige': '#f5ebe0',
        'cafe-lightBrown': '#b08968',
        'cafe-darkBrown': '#7f5539',
        'cafe-amber': '#d97706',
        'cafe-text': '#1f1f1f',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
