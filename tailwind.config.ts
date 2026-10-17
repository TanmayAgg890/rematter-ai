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
          DEFAULT: "#102A22",
          ink: "#102A22",
          950: "#071410",
          900: "#0B1F19",
          850: "#0E241D",
          800: "#102A22",
          700: "#173B30",
          600: "#215344",
        },
        emerald: {
          DEFAULT: "#2FBF83",
          primary: "#2FBF83",
          light: "#8CE6B0",
          dark: "#239364",
          500: "#2FBF83",
          400: "#5FD69E",
          300: "#8CE6B0",
        },
        lime: {
          DEFAULT: "#8CE6B0",
          fresh: "#8CE6B0",
          300: "#B8F2D0",
          400: "#8CE6B0",
          500: "#5FD69E",
        },
        ivory: {
          DEFAULT: "#F6F6F0",
          warm: "#F6F6F0",
          50: "#FCFCF9",
          100: "#F6F6F0",
          200: "#EFEFE8",
          300: "#E2E7E1",
        },
        leaf: {
          DEFAULT: "#2FBF83",
          green: "#2FBF83",
          600: "#239364",
          500: "#2FBF83",
          400: "#5FD69E",
        },
        surface: {
          light: "#FFFFFF",
          warm: "#F6F6F0",
          dark: "#102A22",
          darker: "#0B1F19",
        },
        textPrimary: "#17251F",
        textSecondary: "#58675F",
        textLight: "#F7FAF7",
        textLightMuted: "#C3D0C8",
        borderTone: "#E2E7E1",
        borderLight: "#E2E7E1",
        borderDark: "rgba(255, 255, 255, 0.12)",
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
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
