import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  plugins: [react(), tsconfigPaths(), TanStackRouterVite()],
  server: {
    host: "0.0.0.0", 
    port: 5173, 
    strictPort: true, 
    open: true, 
  },
});
