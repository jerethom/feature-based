/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      colors: (utils) => ({
        app: utils.colors.gray["700"],
        user: utils.colors.gray["900"],
      }),
    },
  },
  plugins: [],
};
