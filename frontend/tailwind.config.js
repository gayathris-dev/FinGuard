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
        fintech: {
          bg: '#080D18',
          sub: '#0D1423',
          sidebar: '#0A1020',
          card: '#111C2E',
          elevated: '#162238',
          hover: '#1A2840',
          border: '#1E2B45',
          borderStrong: '#2A3C60',
          mint: '#00D6A3',
          blue: '#3B82F6',
          amber: '#F5B942',
          crimson: '#F05252',
          text: '#F1F5F9',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'fintech': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
        'fintech-glow': '0 0 25px -5px rgba(0, 214, 163, 0.15)',
        'card-glow': '0 0 15px -3px rgba(59, 130, 246, 0.1)',
      }
    },
  },
  plugins: [],
}
