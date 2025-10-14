import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, ),
      '@common': path.resolve(__dirname, './src/common'),
      '@auth': path.resolve(__dirname, './src/features/auth'),
      '@features': path.resolve(__dirname, './src/features'),
      '@hooks': path.resolve(__dirname, './src/common/hooks'),
      '@utils': path.resolve(__dirname, './src/common/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@api': path.resolve(__dirname, './src/api'),
      '@sockets': path.resolve(__dirname, './src/sockets'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
})
