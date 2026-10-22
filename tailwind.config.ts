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
      // Fine-grained alpha steps used by the editorial palette (text-th-fg/58 etc.).
      // Tailwind's default scale is multiples of 5, so these would emit no CSS otherwise.
      opacity: {
        '12': '0.12',
        '52': '0.52',
        '58': '0.58',
        '62': '0.62',
        '68': '0.68',
        '72': '0.72',
        '78': '0.78',
        '82': '0.82',
        '88': '0.88',
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
