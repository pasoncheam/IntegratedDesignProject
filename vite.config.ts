import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // base url for deployment
  base: "/IntegratedDesignProject/",
  server: {
    host: "::",
    port: 8080,
  },
  // Temporary: force dependency optimization to clear stale cache issues
  optimizeDeps: { force: true },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
