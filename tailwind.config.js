/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: 0,
            transform: "rotateY(100%)",
          },
          "50%": {
            opacity: 0.5,
            transform: "rotateY(50%)",
          },
          "100%": {
            opacity: 1,
            transform: "rotateY(0)",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 500ms ease-in",
      },
    },
  },
  plugins: [],
}
