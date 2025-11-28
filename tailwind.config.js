/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fdfcfa',
          100: '#f9f7f4',
          200: '#f0ebe3',
          300: '#e7dfd2',
          400: '#d4c4b0',
          500: '#c2a88e',
          600: '#a68a6d',
          700: '#8b6d4f',
          800: '#6f5639',
          900: '#544025',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e8e3',
          200: '#c7d1c7',
          300: '#a8b9a8',
          400: '#879d87',
          500: '#6b836b',
          600: '#556955',
          700: '#425342',
          800: '#324032',
          900: '#243124',
        },
        terracotta: {
          50: '#fdf6f4',
          100: '#f9e8e3',
          200: '#f2cfc4',
          300: '#e9b19f',
          400: '#de8b72',
          500: '#d16b4e',
          600: '#b85235',
          700: '#9a4029',
          800: '#7d3322',
          900: '#65291c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
