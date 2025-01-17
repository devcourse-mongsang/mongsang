/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {},
    screens: {
      sm: "640px",

      md: "768px",

      lg: "1024px",

      xl: "1280px",
    },
    colors: {
      "hc-beige": "#fdd6af",
      "hc-blue": "#729ECB",
      "hc-aquaBlue": "#22C1E9",
      "hc-pink": "#B83A9B",
      "hc-coral": "#FD7A87",
      "hc-white": "#FFFFFF",
      "hc-black": "#000000",
      "hc-gray": "#757575",
    },
  },
  plugins: [],
};
