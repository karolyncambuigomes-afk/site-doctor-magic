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
  '/lovable-uploads/b9666d02-1bbe-4bf1-88f4-63fd2c735981.png',
  '/src/assets/hero-elegant-woman.webp'
]);

createRoot(document.getElementById("root")!).render(<App />);
