/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      textColor: {
        skin: {
          base: "var(--color-text-base)",
          muted: "var(--color-text-muted)",
          inverted: "var(--color-text-inverted)",
          accent: "var(--color-text-accent)",
        },
      },
      backgroundColor: {
        skin: {
          fill: "var(--color-fill)",
          "accent-fill": "var(--color-accent-fill)",
          "button-accent": "var(--color-button-accent)",
          "color-button-accent-hover": "var(--color-button-accent-hover)",
          "olor-button-muted": "var( --color-button-muted)",
        },
      },
    },
  },
  plugins: [],
};
