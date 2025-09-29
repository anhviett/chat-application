/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        description: '#72767d',
        backgroundSidebar: '#F8F9FB',
        backgroundInput: '#0d0d0d',
        black: '#141b27',
        'gray-1': '#72767d',
        'gray-2': '#e8e8e9',
        'purple-1': '#7b61ff',
        'purple-2': '#f1edfe',
      },
      fontFamily: {
        'archivo': ['var(--font-archivo)']
      }
    },
  },
  plugins: [],
}

export default config