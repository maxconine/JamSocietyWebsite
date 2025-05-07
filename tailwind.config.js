/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'black-ops-one': ['"Black Ops One"', 'cursive'],
        roboto: ["Roboto", "sans-serif"],
      },
      spacing: {
        '200': '50rem', // 800px
      },
      keyframes: {
        'pulse-smooth': {
          '0%': { opacity: '0.2', transform: 'scale(0.98)' },
          '50%': { opacity: '0.4', transform: 'scale(1)' },
          '100%': { opacity: '0.2', transform: 'scale(0.98)' },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        }
      },
      animation: {
        'pulse-smooth': 'pulse-smooth 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 1.5s cubic-bezier(0.4, 0, 0.6, 1) forwards',
      },
    },
  },
  plugins: [],
}
