/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        midnight: {
          900: "#060814",
          850: "#0B0E23",
          800: "#101432",
          700: "#181E48",
          600: "#222B66",
          500: "#3D4EBA",
          400: "#6374E6",
          300: "#8D9CF3",
          accent: "#00F2FE",
          purple: "#7928CA",
          glow: "#4FACFE"
        }
      }
    },
  },
  plugins: [],
}
