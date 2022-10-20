/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      colors: (utils) => ({
        app: utils.colors.slate["700"],
        "sub-app": utils.colors.slate["500"],
        user: utils.colors.slate["900"],
      }),
    },
  },
  plugins: [],
};
