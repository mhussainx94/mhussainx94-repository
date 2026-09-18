import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens — see README "Design system" for the rationale.
        // Deliberately desaturated ("phosphor", not neon) so the terminal
        // palette the brief asked for reads as engineered, not decorative.
        void: "var(--c-void)",
        panel: "var(--c-panel)",
        raised: "var(--c-raised)",
        line: "var(--c-line)",
        "line-strong": "var(--c-line-strong)",
        ink: "var(--c-ink)",
        "ink-muted": "var(--c-ink-muted)",
        "ink-faint": "var(--c-ink-faint)",
        signal: {
          DEFAULT: "var(--c-signal)",
          dim: "var(--c-signal-dim)",
          bright: "var(--c-signal-bright)",
        },
        cyan: {
          DEFAULT: "var(--c-cyan)",
          dim: "var(--c-cyan-dim)",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
      },
      maxWidth: {
        measure: "68ch",
      },
      keyframes: {
        "cursor-blink": {
          "0%, 45%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "cursor-blink": "cursor-blink 1.1s step-end infinite",
        "glow-pulse": "glow-pulse 3.2s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out both",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
