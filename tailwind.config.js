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
        cream: "#EAE7DC",
        sand: "#D8C3A5",
        gray: "#8E8D8A",
        coral: "#E98074",
        "coral-dark": "#E85A4F",
      },
    },
  },
  plugins: [],
};
