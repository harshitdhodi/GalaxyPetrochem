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
      moduleOnly: true,
    }),
    tailwindcss(),
    svgr({ svgrOptions: { icon: true, ref: true } }),
    viteCompression({ algorithm: "brotliCompress" }),
  ],

  resolve: {
    alias: { 
      "@": path.resolve(__dirname, "./src"),
    },
    // Use simpler dedupe approach
    dedupe: ['react', 'react-dom', 'react-router-dom']
  },

  build: {
    rollupOptions: {
      input: { main: "./index.html" },
      output: {
        // Simpler chunking strategy to avoid initialization order issues
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-utils': ['axios'],
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