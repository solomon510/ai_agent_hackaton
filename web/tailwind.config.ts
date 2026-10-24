import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#18181B', // Near black matching screenshot primary button
          hover: '#27272A',
          subtle: '#3F3F46',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F9FAFB',
          card: '#F3F4F6',
          border: '#E5E7EB',
          'border-light': '#F3F4F6',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
