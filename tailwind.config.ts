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
        'th': {
          'bg': 'rgb(var(--c-bg) / <alpha-value>)',
          'fg': 'rgb(var(--c-fg) / <alpha-value>)',
          'surface': 'rgb(var(--c-surface) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
