/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      colors: {
        primary: "#1F2937",    // Dark gray (header/footer)
        secondary: "#3B82F6",  // Blue (buttons/links)
        accent: "#FBBF24",     // Yellow (highlights)
        background: "#111827", // Slightly darker background
        surface: "#1E293B",    // Card backgrounds
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
