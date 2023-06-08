import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import UnoCSS from "unocss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://192.168.2.6:8080/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }
  },
});
