/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          blackops: ["'Black Ops One'", "cursive"],
          roboto: ["Roboto", "sans-serif"],
        },
      },
    },
    plugins: [],
  }
  