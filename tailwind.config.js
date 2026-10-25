/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        thadi: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          amber: '#f59e0b',
          amberHover: '#d97706',
          emerald: '#10b981',
          teal: '#14b8a6',
          sky: '#0284c7'
        }
      }
    },
  },
  plugins: [],
}
