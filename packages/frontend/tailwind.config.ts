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
        backgroundSidebar: '#181818',
        backgroundInput: '#0d0d0d',
        white: '#d8dfeb'
      }
    },
  },
  plugins: [],
}

export default config