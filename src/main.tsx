import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider'

console.log('Main.tsx: Starting application initialization');

console.log('Main.tsx: Creating root and rendering app');

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem
    disableTransitionOnChange
  >
    <App />
  </ThemeProvider>
);

// Initialize optimizations after render
setTimeout(() => {
  import('./utils/bundleOptimizer').then(({ initializeBundleOptimizations }) => {
    initializeBundleOptimizations();
  });
  
  import('./utils/performanceOptimizer').then(({ initializePerformanceOptimizations }) => {
    initializePerformanceOptimizations();
  });

  import('./utils/imageOptimizer').then(({ preloadCriticalImages }) => {
    preloadCriticalImages([
      '/lovable-uploads/4b8ba540-676f-4e57-9771-9e3a6638f837.png',
      '/src/assets/hero-elegant-woman.webp'
    ]);
  });
}, 100);
