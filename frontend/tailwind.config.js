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
        'primary': '#006948',
        'primary-container': '#00855d',
        'primary-fixed': '#85f8c4',
        'primary-fixed-dim': '#68dba9',
        'on-primary': '#ffffff',
        'on-primary-container': '#f5fff7',
        'on-primary-fixed': '#002114',
        'on-primary-fixed-variant': '#005137',
        'inverse-primary': '#68dba9',

        'secondary': '#006398',
        'secondary-container': '#5bb8fe',
        'secondary-fixed': '#cce5ff',
        'secondary-fixed-dim': '#93ccff',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#00476e',
        'on-secondary-fixed': '#001d31',
        'on-secondary-fixed-variant': '#004b73',

        'tertiary': '#b90538',
        'tertiary-container': '#dc2c4f',
        'tertiary-fixed': '#ffdadb',
        'tertiary-fixed-dim': '#ffb2b7',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#fffbff',
        'on-tertiary-fixed': '#40000d',
        'on-tertiary-fixed-variant': '#92002a',

        'surface': '#f8f9ff',
        'surface-bright': '#f8f9ff',
        'surface-dim': '#ccdbf3',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e6eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d5e3fc',
        'on-surface': '#0d1c2e',
        'on-surface-variant': '#3d4a42',
        'inverse-surface': '#233144',
        'inverse-on-surface': '#eaf1ff',

        'outline': '#6d7a72',
        'outline-variant': '#bccac0',
        'surface-tint': '#006c4a',

        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

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
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
