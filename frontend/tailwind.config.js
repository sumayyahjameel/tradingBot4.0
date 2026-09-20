/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#121215',
        'surface-elevated': '#18181b',
        'surface-hover': '#222226',
        border: '#27272a',
        'border-subtle': '#1c1c20',
        'border-bright': '#3f3f46',
        primary: '#fafafa',
        'primary-muted': '#e4e4e7',
        secondary: '#a1a1aa',
        muted: '#71717a',
        faint: '#3f3f46',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
