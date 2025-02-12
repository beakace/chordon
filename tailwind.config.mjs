/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-dark": "#141414",
        primary: "#273DB4",
        secondary: "#C50900",
        "accent-1": "#F95CA4",
        "accent-2": "#ED7845",
      },
    },
  },
  plugins: [],
};
