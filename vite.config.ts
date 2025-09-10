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
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Heavy admin libraries in separate chunks
          if (id.includes('fabric')) return 'fabric';
          if (id.includes('recharts')) return 'recharts';
          
          // Core libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          
          // UI libraries chunk
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-vendor';
          }
          
          // Supabase chunk
          if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
            return 'supabase';
          }
          
          // Admin pages chunk
          if (id.includes('/pages/admin/') || id.includes('/layouts/AdminLayout')) {
            return 'admin';
          }
          
          // Large utility libraries
          if (id.includes('node_modules/date-fns') || id.includes('node_modules/clsx')) {
            return 'utils';
          }
        }
      }
    },
    sourcemap: false,
    assetsInlineLimit: 2048, // Reduced for smaller bundles
    chunkSizeWarningLimit: 1000
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
