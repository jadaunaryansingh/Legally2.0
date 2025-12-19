import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "slide-up": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "glow-scale": {
          "0%": {
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(255, 255, 255, 0.8)",
          },
          "100%": {
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          },
        },
        "fade-out": {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
        "dancing-glow": {
          "0%": {
            textShadow: "0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)",
            transform: "translateY(0) scaleY(1)",
          },
          "25%": {
            textShadow: "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)",
            transform: "translateY(-5px) scaleY(1.05)",
          },
          "50%": {
            textShadow: "0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.7)",
            transform: "translateY(0) scaleY(1)",
          },
          "75%": {
            textShadow: "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)",
            transform: "translateY(-5px) scaleY(1.05)",
          },
          "100%": {
            textShadow: "0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)",
            transform: "translateY(0) scaleY(1)",
          },
        },
        "sparkling": {
          "0%, 100%": {
            opacity: "0.4",
            filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))",
          },
          "50%": {
            opacity: "1",
            filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))",
          },
        },
        "glow-text": {
          "0%": {
            color: "rgba(255, 255, 255, 0.8)",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.4)",
          },
          "50%": {
            color: "rgba(255, 255, 255, 1)",
            textShadow: "0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6)",
          },
          "100%": {
            color: "rgba(255, 255, 255, 0.8)",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.4)",
          },
        },
        "rainbow-glow": {
          "0%": {
            textShadow: "0 0 10px rgba(255, 100, 100, 0.6), 0 0 20px rgba(255, 100, 100, 0.3)",
          },
          "25%": {
            textShadow: "0 0 10px rgba(100, 200, 255, 0.6), 0 0 20px rgba(100, 200, 255, 0.3)",
          },
          "50%": {
            textShadow: "0 0 10px rgba(100, 255, 100, 0.6), 0 0 20px rgba(100, 255, 100, 0.3)",
          },
          "75%": {
            textShadow: "0 0 10px rgba(255, 200, 100, 0.6), 0 0 20px rgba(255, 200, 100, 0.3)",
          },
          "100%": {
            textShadow: "0 0 10px rgba(255, 100, 100, 0.6), 0 0 20px rgba(255, 100, 100, 0.3)",
          },
        },
        "pulse-scale": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: "0.8",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "glow-scale": "glow-scale 2s ease-in-out infinite",
        "fade-out": "fade-out 0.8s ease-out forwards",
        "balance-left": "balance-left 2s ease-in-out infinite",
        "balance-right": "balance-right 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "click-ripple": "click-ripple 0.6s ease-out",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-glow": "pulse-glow 2s infinite",
        "spin-smooth": "spin-smooth 2s linear infinite",
        "shimmer": "shimmer 2s infinite",
        "float": "float 3s ease-in-out infinite",
        "dancing-glow": "dancing-glow 3s ease-in-out infinite",
        "sparkling": "sparkling 2.5s ease-in-out infinite",
        "glow-text": "glow-text 2s ease-in-out infinite",
        "rainbow-glow": "rainbow-glow 4s ease-in-out infinite",
        "pulse-scale": "pulse-scale 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
