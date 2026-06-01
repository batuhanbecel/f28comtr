import type { Config } from "tailwindcss";

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'th': {
          'bg': 'rgb(var(--c-bg) / <alpha-value>)',
          'fg': 'rgb(var(--c-fg) / <alpha-value>)',
          'surface': 'rgb(var(--c-surface) / <alpha-value>)',
        },
      },
      transitionTimingFunction: {
        brand: 'var(--ease-brand)',
        morph: 'var(--ease-morph)',
        snappy: 'var(--ease-snappy)',
      },
      transitionDuration: {
        reveal: 'var(--duration-reveal-ms)',
        hover: 'var(--duration-hover-ms)',
        ui: 'var(--duration-ui-ms)',
      },
    },
  },
  plugins: [],
} satisfies Config;
