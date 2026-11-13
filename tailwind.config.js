/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'Fira Code'", "'Cascadia Code'", "'Consolas'", "monospace"],
        sans: ["'Segoe UI'", "Roboto", "system-ui", "sans-serif"],
      },
      colors: {
        cyber: {
          black: "#0a0a0c",
          panel: "#111318",
          border: "#1f232e",
          cyan: "#00f3ff",
          green: "#0aff88",
          magenta: "#ff00ff",
          amber: "#ffb300",
          dim: "#6b7280",
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shake": "shake 0.4s cubic-bezier(.36,.07,.19,.97) both",
        "scanline": "scanline 6s linear infinite",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "slide-up": "slide-up 0.4s ease-out forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(0,243,255,0.25)", borderColor: "rgba(0,243,255,0.35)" },
          "50%": { boxShadow: "0 0 30px rgba(0,243,255,0.55)", borderColor: "rgba(0,243,255,0.7)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
