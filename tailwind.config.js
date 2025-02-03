/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      aspectRatio: {
        "4/3": "4 / 3",
      },
      boxShadow: {
        blue: "-4px 4px 50px 0px rgba(114, 158, 203, 0.70)",
        "dark-blue": "-4px 4px 50px 0px rgba(12, 59, 81, 0.40)",
      },
    },
    screens: {
      xm: "376px",

      sm: "640px",

      md: "768px",

      lg: "1024px",

      xl: "1280px",

      "2xl": "1536px",

      "3xl": "1920px",
    },
    colors: {
      "hc-beige": "#fdd6af",
      "hc-blue": "#729ECB",
      "hc-aqua-blue": "#22C1E9",
      "hc-pink": "#B83A9B",
      "hc-coral": "#FD7A87",
      "hc-white": "#FFFFFF",
      "hc-black": "#000000",
      "hc-gray": "#757575",

      //다크모드 색상
      "hc-dark-blue": "#0C3B51",
      "hc-dark-teal": "#154F6A",
      "hc-dark-cocoa": "#91625C",
      "hc-dark-mocha": "#634042",
    },
  },
  plugins: [],
};
