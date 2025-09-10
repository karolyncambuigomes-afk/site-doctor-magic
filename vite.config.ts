import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import fs from 'fs';

// CSS optimization plugin
const cssOptimizationPlugin = () => {
  return {
    name: 'css-optimization',
    order: 'pre' as const,
    transformIndexHtml: {
      order: 'pre' as const,
      handler(html: string) {
        try {
          // Inline critical CSS
          const criticalCSS = fs.readFileSync(
            path.resolve(__dirname, 'src/styles/critical-inline.css'),
            'utf-8'
          );
          
          return html.replace(
            '<head>',
            `<head>
              <style data-critical-css>
                ${criticalCSS}
              </style>
              <link rel="preload" href="/assets/index.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
              <noscript><link rel="stylesheet" href="/assets/index.css"></noscript>`
          );
        } catch (error) {
          console.warn('Could not inline critical CSS:', error);
          return html;
        }
      }
    }
  };
};

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
          // Critical vendor libraries that should be loaded immediately
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          
          // Heavy libraries that can be lazy loaded
          if (id.includes('fabric')) return 'fabric';
          if (id.includes('recharts')) return 'charts';
          if (id.includes('embla-carousel')) return 'carousel';
          
          // Admin-only chunks (lazy loaded)
          if (id.includes('/pages/admin/') || id.includes('/layouts/AdminLayout')) {
            return 'admin-pages';
          }
          if (id.includes('/components/admin/') || id.includes('AdminProtectedRoute')) {
            return 'admin-components';
          }
          
          // Supabase and query clients
          if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
            return 'api-client';
          }
          
          // UI component libraries
          if (id.includes('@radix-ui')) return 'ui-library';
          if (id.includes('lucide-react')) return 'icons';
          
          // Page-specific chunks for better code splitting
          if (id.includes('/pages/Models') || id.includes('/components/Models')) {
            return 'models-feature';
          }
          if (id.includes('/pages/Blog') || id.includes('/components/blog/')) {
            return 'blog-feature';
          }
          if (id.includes('/pages/About') || id.includes('/pages/Services') || 
              id.includes('/pages/Contact') || id.includes('/pages/FAQ')) {
            return 'static-pages';
          }
          
          // Mobile-specific features (can be lazy loaded)
          if (id.includes('MobileOptimizer') || id.includes('MobileRefresh') || 
              id.includes('MobileDebug') || id.includes('MobileSync')) {
            return 'mobile-features';
          }
          
          // Analytics and tracking (can be deferred)
          if (id.includes('Analytics') || id.includes('ServiceWorker') || 
              id.includes('CookieConsent')) {
            return 'analytics';
          }
          
          // Utility libraries
          if (id.includes('node_modules/date-fns') || id.includes('node_modules/clsx') ||
              id.includes('node_modules/class-variance-authority')) {
            return 'utils';
          }
        },
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Organize assets by type
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (assetInfo.name?.match(/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (assetInfo.name?.match(/\.(woff2?|eot|ttf|otf)$/i)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    sourcemap: false,
    assetsInlineLimit: 1024,
    chunkSizeWarningLimit: 500,
    minify: 'esbuild',
    cssMinify: 'esbuild',
    cssCodeSplit: true
  },
  plugins: [
    react(),
    cssOptimizationPlugin(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));