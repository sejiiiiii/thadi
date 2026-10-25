/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface: {
          base: '#090a0d',
          card: '#12141a',
          elevated: '#1a1c24',
          subtle: '#222631'
        },
        thadi: {
          forest: '#005c13',
          emerald: '#10b981',
          emeraldMuted: '#064e3b',
          amber: '#f59e0b',
          amberMuted: '#78350f',
          sky: '#0ea5e9'
        }
      },
      boxShadow: {
        'bezel': 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 4px 20px rgba(0, 0, 0, 0.4)',
        'bezel-hover': 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 30px rgba(0, 0, 0, 0.5)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.25)'
      }
    },
  },
  plugins: [],
}
