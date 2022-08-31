/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "footer-background": "#097A8C",
        hover: "#0F5F6B",
        delivery: "#F26039",
        button: "#668D58",
        link: "#E8AD49",
      },
      spacing: {
        550: "550px",
        100: "100px",
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "scale(1)",
          },
          "33%": {
            transform: "scale(1.21)",
          },
          "66%": {
            transform: "scale(0.9)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
      },
      backgroundImage: {
        "split-menubg":
          "linear-gradient(to top, #2D618A 70%, transparent 30%);",
      },
    },
    minHeight: {
      "485": "485px",
    }
  },
  plugins: [],
};
