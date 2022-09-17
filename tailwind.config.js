/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      boxShadow: {
        custom:
          "3px 3px 5px rgba(255, 255, 255, 0.1), -3px -3px 5px rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        poppins: "'Poppins', sans-serif",
      },
      colors: {
        lightBlack: "rgba(0, 0, 0, 0.1)",
      },
      spacing: {
        "90": '83vh'
      }
    },
  },
  plugins: [],
};
