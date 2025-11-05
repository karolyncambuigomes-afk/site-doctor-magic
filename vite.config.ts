import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("fabric")) return "fabric";
          if (id.includes("recharts")) return "recharts";
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "react-vendor";
          }
          if (id.includes("node_modules/react-router")) {
            return "router";
          }
          if (
            id.includes("lucide-react/dynamicIconImports") ||
            id.includes("lucide-react/dist/esm/icons")
          ) {
            return "lucide-icons";
          }
          if (id.includes("lucide-react")) {
            return "lucide-core";
          }
          if (
            id.includes("@radix-ui/react-dropdown-menu") ||
            id.includes("@radix-ui/react-dialog") ||
            id.includes("@radix-ui/react-alert-dialog")
          ) {
            return "radix-modals";
          }
          if (id.includes("@radix-ui")) {
            return "radix-core";
          }
          if (
            id.includes("@supabase") ||
            id.includes("@tanstack/react-query")
          ) {
            return "supabase";
          }
          if (
            id.includes("/pages/admin/") ||
            id.includes("/layouts/AdminLayout")
          ) {
            return "admin";
          }
          if (
            id.includes("/pages/Models") ||
            id.includes("/components/ModelsGallery")
          ) {
            return "models-page";
          }
          if (id.includes("/pages/Blog") || id.includes("/components/blog/")) {
            return "blog-page";
          }
          if (id.includes("/pages/About") || id.includes("/pages/Services")) {
            return "content-pages";
          }
          if (
            id.includes("node_modules/date-fns") ||
            id.includes("node_modules/clsx")
          ) {
            return "utils";
          }
          if (id.includes("embla-carousel")) {
            return "carousel";
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || "")) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || "")) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    sourcemap: false,
    assetsInlineLimit: 512,
    chunkSizeWarningLimit: 800,
    minify: mode === "production" ? "terser" : false,
    terserOptions:
      mode === "production"
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: [
                "console.log",
                "console.info",
                "console.warn",
                "console.error",
              ],
              passes: 3,
              unsafe_arrows: true,
              unsafe_methods: true,
            },
            mangle: {
              safari10: true,
            },
            format: {
              comments: false,
            },
          }
        : undefined,
    cssMinify: true,
    reportCompressedSize: true,
    assetsDir: "assets",
    emptyOutDir: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
