import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Temporarily disabled optimizations to fix blue screen issue
// import { initializeBundleOptimizations } from './utils/bundleOptimizer'
// import { initializePerformanceOptimizations } from './utils/performanceOptimizer'
// import { preloadCriticalImages } from './utils/imageOptimizer'

// Initialize performance optimizations
// initializeBundleOptimizations();
// initializePerformanceOptimizations();

// Preload critical images
// preloadCriticalImages([
//   '/src/assets/hero-main.webp',
//   '/src/assets/hero-elegant-woman.webp'
// ]);

createRoot(document.getElementById("root")!).render(<App />);
