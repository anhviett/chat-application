import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "https://dummyjson.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/common": path.resolve(__dirname, "./src/common"),
      "@/auth": path.resolve(__dirname, "./src/features/auth"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/hooks": path.resolve(__dirname, "./src/common/hooks"),
      "@/utils": path.resolve(__dirname, "./src/common/utils"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/layouts": path.resolve(__dirname, "./src/layouts"),
      "@/api": path.resolve(__dirname, "./src/api"),
      "@/sockets": path.resolve(__dirname, "./src/sockets"),
      "@/contexts": path.resolve(__dirname, "./src/contexts"),
      "@/stores": path.resolve(__dirname, "./src/stores"),
      "@/enums": path.resolve(__dirname, "./src/common/enums"),
      "@/types": path.resolve(__dirname, "./src/common/types"),
    },
  },
});
