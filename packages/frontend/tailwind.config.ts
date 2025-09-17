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
        black: '#141b27'
        }
    },
  },
  plugins: [],
}

export default config