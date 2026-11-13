/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "'Segoe UI'", "Roboto", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Cascadia Code'", "'Fira Code'", "'Consolas'", "monospace"],
      },
      colors: {
        ink: {
          950: "#080f1c",
          900: "#0b1120",
          800: "#111827",
          700: "#131c2e",
          600: "#1a2540",
        },
        accent: {
          soft: "#5eead4",
          DEFAULT: "#22d3ee",
          deep: "#818cf8",
        },
        cyber: {
          black: "#0b1120",
          panel: "#131c2e",
          border: "rgba(148,163,184,0.18)",
          cyan: "#22d3ee",
          green: "#34d399",
          magenta: "#fb7185",
          amber: "#fbbf24",
          dim: "#94a3b8",
          muted: "#64748b",
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s cubic-bezier(0.22,1,0.36,1) forwards",
        "slide-up": "slide-up 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
        shake: "shake 0.4s cubic-bezier(.36,.07,.19,.97) both",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-5px)" },
          "40%, 80%": { transform: "translateX(5px)" },
        },
      },
    },
  },
  plugins: [],
};
