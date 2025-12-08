import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Custom breakpoints matching Chakra setup
    // Mobile-first: base is mobile, sm+ is desktop
    // Chakra uses 62em (992px) as the main breakpoint
    screens: {
      sm: "992px", // 62em
      md: "992px", // 62em
      lg: "992px", // 62em
      xl: "1280px", // 80em
      "2xl": "1280px", // 80em
    },
    extend: {
      colors: {
        neon: {
          200: "#11ED83",
          300: "#16C973",
          400: "#11ED83",
          500: "#157342",
          600: "#1F422A",
          700: "#202F20",
          800: "#1C291C",
          900: "#172217",
        },
        "neon-900-alpha": "#424b42DD",
        yellow: {
          400: "#FBCB4A",
          500: "#8a7830",
          600: "#6d5804",
        },
        red: "#FB744A",
        "app-gray": "#231F20",
        "dojo-red": "#ff2f42",
        "cartridge-yellow": "#FFC52A",
        "white-alpha-100": "rgba(255, 255, 255, 0.03)",
      },
      fontFamily: {
        body: ["dos-vga", "sans-serif"],
        heading: ["ppmondwest", "sans-serif"],
        "broken-console": ["broken-console", "sans-serif"],
        "pixel-script": ["pixel-script", "sans-serif"],
        "chicago-flf": ["chicago-flf", "sans-serif"],
        ppneuebit: ["ppneuebit", "sans-serif"],
      },
      letterSpacing: {
        default: "0.04em",
        subheading: "0.25em",
      },
      keyframes: {
        blink: {
          "0%, 70%": { opacity: "0.5" },
          "71%, 100%": { opacity: "0" },
        },
        "health-blink": {
          "0%, 80%": { opacity: "1" },
          "81%, 100%": { opacity: "0" },
        },
        "health-blink-fast": {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        blink: "blink 1.2s linear infinite",
        "health-blink": "health-blink 1.4s linear infinite",
        "health-blink-fast": "health-blink-fast 0.6s linear infinite",
        "slide-in": "slideIn 0.3s ease-out",
        "slide-out": "slideOut 0.3s ease-in",
        "fade-in": "fadeIn 0.2s ease-out",
        "fade-out": "fadeOut 0.2s ease-in",
        spin: "spin 1s linear infinite",
      },
      spacing: {
        "1.5": "6px", // For rounded layer style padding
      },
    },
  },
  plugins: [],
};

export default config;
