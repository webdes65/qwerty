/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Quicksand: ["Quicksand", "sans"],
        IRANSans: ["IRANSans", "sans-serif"],
      },
      colors: {
        lightGray: "#F0F0F0",
        darkBlue: "#0025B1",
        royalBlue: "#1A56DC",
        lightBlue: "#c1d4ff",
        tealBlue: "#2AC3DE",
        gray: { 100: "#333333" },
        gray200: "rgb(209 213 219)",
        dark: { 100: "#1E1E1E" },
      },
    },
  },
  plugins: [],
};
