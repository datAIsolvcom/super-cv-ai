import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        serif: ["var(--font-playfair)", ...fontFamily.serif],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#020617", 
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#f59e0b", 
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1e293b", 
          foreground: "#f8fafc",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#0f172a", 
          foreground: "#94a3b8", 
        },
        accent: {
          DEFAULT: "rgba(15, 23, 42, 0.5)", 
          foreground: "#f59e0b",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(to right, #020617, #0f172a)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;