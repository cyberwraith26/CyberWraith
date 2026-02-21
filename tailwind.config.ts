import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-green": "#00ff88",
        "brand-cyan": "#00d4ff",
        "brand-purple": "#a855f7",
        "brand-amber": "#f59e0b",
        "brand-red": "#ef4444",
        dark: "#050a0f",
        "dark-100": "#0a1520",
        "dark-200": "#0d1f2d",
      },
      fontFamily: {
        mono: ["Share Tech Mono", "monospace"],
        display: ["Rajdhani", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 255, 136, 0.4)",
        "neon-cyan": "0 0 20px rgba(0, 212, 255, 0.4)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-in-right": "slideInRight 0.3s ease forwards",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 255, 136, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 255, 136, 0.6)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;