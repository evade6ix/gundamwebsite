/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F2937",    // Dark gray (header/footer)
        secondary: "#3B82F6",  // Blue (buttons/links)
        accent: "#FBBF24",     // Yellow (highlights/hover)
      },
    },
  },
  plugins: [],
}
