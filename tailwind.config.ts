import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#10251F",
          ink: "#10251F",
          900: "#0A1814",
          800: "#10251F",
          700: "#18382E",
          600: "#224C3F",
        },
        lime: {
          DEFAULT: "#D8F3BD",
          fresh: "#D8F3BD",
          300: "#E3F7CE",
          400: "#D8F3BD",
          500: "#C4E8A2",
        },
        ivory: {
          DEFAULT: "#F7F7F0",
          warm: "#F7F7F0",
          50: "#FCFCF9",
          100: "#F7F7F0",
          200: "#EFEFE4",
        },
        leaf: {
          DEFAULT: "#477B55",
          green: "#477B55",
          600: "#3A6646",
          500: "#477B55",
          400: "#5B966C",
        },
        secondaryText: "#68766B",
        borderTone: "#E3E8DF",
        caution: "#E6A23C",
        danger: "#C74747",
      },
      borderRadius: {
        card: "18px",
        pill: "9999px",
      },
      maxWidth: {
        container: "1200px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
