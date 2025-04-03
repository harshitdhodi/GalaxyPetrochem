import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteCompression from "vite-plugin-compression";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, 
      filename: "stats.html",  
      template: "treemap",  
      gzipSize: true,
      brotliSize: true,
      sourcemap: true,
      title: "Bundle Analysis",
      moduleOnly: true,  // Shows module names instead of full file paths
    }),
    tailwindcss(),
    svgr({ svgrOptions: { icon: true, ref: true } }),
    viteCompression({ algorithm: "brotliCompress" }),
  ],

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  build: {
    rollupOptions: {
      input: { main: "./index.html" },
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          utils: ["axios"], 
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
    chunkSizeWarningLimit: 600,
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        pure_funcs: ["console.log", "console.info"],
      },
    },
    sourcemap: true,
  },

  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3028",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  base: "/",
});
