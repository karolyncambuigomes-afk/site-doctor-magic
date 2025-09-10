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
          
          // Lucide React separate chunk for lazy loading
          if (id.includes('lucide-react/dynamicIconImports') || id.includes('lucide-react/dist/esm/icons')) {
            return 'lucide-icons';
          }
          if (id.includes('lucide-react')) {
            return 'lucide-core';
          }
          
          // Radix UI components chunking
          if (id.includes('@radix-ui/react-dropdown-menu') || 
              id.includes('@radix-ui/react-dialog') || 
              id.includes('@radix-ui/react-alert-dialog')) {
            return 'radix-modals';
          }
          if (id.includes('@radix-ui')) {
            return 'radix-core';
          }
          
          // Supabase chunk
          if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
            return 'supabase';
          }
          
          // Admin pages chunk
          if (id.includes('/pages/admin/') || id.includes('/layouts/AdminLayout')) {
            return 'admin';
          }
          
          // Page-based chunks for better caching
          if (id.includes('/pages/Models') || id.includes('/components/ModelsGallery')) {
            return 'models-page';
          }
          if (id.includes('/pages/Blog') || id.includes('/components/blog/')) {
            return 'blog-page';
          }
          if (id.includes('/pages/About') || id.includes('/pages/Services')) {
            return 'content-pages';
          }
          
          // Large utility libraries
          if (id.includes('node_modules/date-fns') || id.includes('node_modules/clsx')) {
            return 'utils';
          }
          
          // Embla carousel separate chunk
          if (id.includes('embla-carousel')) {
            return 'carousel';
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
