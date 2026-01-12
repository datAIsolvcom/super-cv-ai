import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      colors: {
        // Include full slate palette
        slate: colors.slate,

        // Surface colors (dark backgrounds)
        surface: {
          DEFAULT: "#0f172a",   // slate-900
          dark: "#020617",      // slate-950
          light: "#1e293b",     // slate-800
          muted: "#334155",     // slate-700
        },

        // Obsidian (legacy support)
        obsidian: {
          900: "#0f172a",
          950: "#020617",
        },

        // Primary (Electric Blue)
        primary: {
          DEFAULT: "#2F6BFF",
          50: "#EEF3FF",
          100: "#E0EAFF",
          200: "#C7D7FE",
          300: "#A4BCFD",
          400: "#8098FA",
          500: "#2F6BFF",
          600: "#1E55F0",
          700: "#1642DD",
          800: "#1838B3",
          900: "#19338D",
        },

        // Secondary (Optimistic Yellow)
        secondary: {
          DEFAULT: "#FFD84D",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FFD84D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },

        // Accent (Mint Green)
        accent: {
          DEFAULT: "#3CE0B1",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#3CE0B1",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-gradient":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
        "gradient-primary": "linear-gradient(135deg, #2F6BFF 0%, #3CE0B1 100%)",
        "gradient-secondary": "linear-gradient(135deg, #FFD84D 0%, #3CE0B1 100%)",
        "gradient-accent": "linear-gradient(135deg, #2F6BFF 0%, #FFD84D 100%)",
        "gradient-mesh": `radial-gradient(at 40% 20%, rgba(47, 107, 255, 0.15) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(60, 224, 177, 0.12) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(255, 216, 77, 0.1) 0px, transparent 50%)`,
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        // New: Gentle pulse for loading states
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        // New: Slide up for enter animations
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      // Icon sizes - Standardized across app
      spacing: {
        "icon-sm": "16px",
        "icon-md": "20px",
        "icon-lg": "24px",
        "icon-xl": "32px",
      },
    },
  },
  plugins: [],
};

export default config;