import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        ivory: "#FFFCF6",
        cloud: "#F6F6F8",
        charcoal: "#1C1A1E",
        graphite: "#2E2A33",
        stone: "#5C5862",
        muted: "#8E8996",
        line: "#E5E1E9",
        orange: "#F6B11C",
        "orange-dark": "#E18A00",
        sand: "#FEEBCB",
        peach: "#FEDCB3",
        mint: "#CDEEC4",
        "mint-dark": "#8FBA83",
        sage: "#EAF6E5",
        blush: "#FFF5E6",
        onyx: "#121015",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "Poppins", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        display: "0 40px 120px -60px rgba(20,18,30,0.55)",
        card: "0 40px 70px -55px rgba(20,18,30,0.65)",
        pill: "0 25px 60px -45px rgba(20,18,30,0.75)",
      },
      borderRadius: {
        blob: "3.75rem",
        pill: "999px",
      },
      fontSize: {
        "display-1": ["4rem", { lineHeight: "1.04", letterSpacing: "-0.03em" }],
        "display-2": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
    },
  },
  plugins: [],
};

export default config;

