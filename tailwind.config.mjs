/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-syne)"],
      },
      colors: {
        "primary-dark": "#314455",
        primary: "#97AABD",
        secondary: "#C96567",
        "accent-1": "#C96567",
        "accent-2": "#644E5B",
      },
      backgroundImage: {
        "gradient-conic":
          "linear-gradient(90deg, #314455, #644E5B, #9E5A63, #C96567, #97AABD)",
      },
    },
  },
  plugins: [],
};
