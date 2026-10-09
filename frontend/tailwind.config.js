export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 500: "#4A00E0", 600: "#3d00b8", 700: "#320098" },
        violet: "#8E2DE2",
        pink: "#EC4899"
      },
      boxShadow: { soft: "0 20px 60px rgba(74,0,224,.10)" }
    }
  },
  plugins: []
};
