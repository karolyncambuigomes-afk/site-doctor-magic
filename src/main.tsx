<<<<<<< HEAD
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider'
import { MobilePerformanceOptimizer } from './components/MobilePerformanceOptimizer'
import { AdvancedMobileOptimizer } from './components/AdvancedMobileOptimizer'

console.log('Main.tsx: Starting application initialization');

console.log('Main.tsx: Creating root and rendering app');

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem
    disableTransitionOnChange
  >
    <AdvancedMobileOptimizer />
    <MobilePerformanceOptimizer />
    <App />
  </ThemeProvider>
);

=======
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeBundleOptimizations } from './utils/bundleOptimizer'
import { initializePerformanceOptimizations } from './utils/performanceOptimizer'
import { preloadCriticalImages } from './utils/imageOptimizer'

// Initialize performance optimizations
initializeBundleOptimizations();
initializePerformanceOptimizations();

// Preload critical images
preloadCriticalImages([
  '/lovable-uploads/4b8ba540-676f-4e57-9771-9e3a6638f837.png',
  '/src/assets/hero-elegant-woman.webp'
]);

createRoot(document.getElementById("root")!).render(<App />);
>>>>>>> 4d6ac79 (Update all project files: bug fixes, new features, and improvements)
