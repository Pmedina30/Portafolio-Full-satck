/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        baseus: {
          yellow: "#FFDD00",
          yellowHover: "#FACC15",
          yellowMuted: "rgba(255, 221, 0, 0.15)",
          graphite: "#0F1115",
          obsidian: "#181A20",
          darkBg: "#0B0C0E",
          card: "#FFFFFF",
          cardBg: "#F8F9FA",
          surface: "#F3F4F6",
          border: "#E5E7EB",
          subtle: "#E2E8F0",
          darkCard: "#15181E",
          darkBorder: "#262930",
        },
        amazon: {
          orange: "#ff9900",
          yellow: "#febd69",
          navy: "#131921",
          lightNavy: "#232f3e",
        },
        stitch: {
          primary: "#0047ba",
          primaryDark: "#003282",
          navy: "#0b192c",
          navyLight: "#132742",
          gold: "#ffb800",
          amber: "#ff9900",
          emerald: "#059669",
          emeraldLight: "#10b981",
          surfaceLight: "#f8fafc",
          surfaceDark: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
