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
        'gray-1': '#72767d',
        'gray-2': '#e8e8e9',
        'gray-3': '#f7f8fa',
        backgroundSidebar: '#F8F9FB',
        backgroundInput: '#0d0d0d',
        black: '#141b27',
        'purple-1': '#7b61ff',
        'purple-1-hover': '#582af5',
        'purple-2': '#f1edfe',
        'red-1': '#fd3a55',
      },
      fontFamily: {
        'archivo': ['var(--font-archivo)']
      },
      keyframes: {
        bounceDot: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }, // Adjust bounce height as needed
        },
        fadeDot: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'dot-bounce-1': 'bounceDot 1s infinite ease-in-out',
        'dot-bounce-2': 'bounceDot 1s infinite ease-in-out 0.2s', // Staggered delay
        'dot-bounce-3': 'bounceDot 1s infinite ease-in-out 0.4s', // Staggered delay
        'dot-fade-1': 'fadeDot 1.5s infinite ease-in-out',
        'dot-fade-2': 'fadeDot 1.5s infinite ease-in-out 0.5s',
        'dot-fade-3': 'fadeDot 1.5s infinite ease-in-out 1s',
      },
    },
  },
  plugins: [],
}

export default config