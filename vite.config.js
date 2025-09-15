import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  publicDir: "public",
  plugins: [react()],
  server: {
    allowedHosts: [".ngrok-free.app"],
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@template": path.resolve(__dirname, "./src/components/template"),
      "@module": path.resolve(__dirname, "./src/components/module"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@redux_toolkit": path.resolve(__dirname, "./src/redux_toolkit"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@version": path.resolve(__dirname, "./src/version"),
    },
  },
  build: {
    outDir: "dist",
  },
});
