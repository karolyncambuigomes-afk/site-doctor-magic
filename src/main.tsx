import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeBundleOptimizations } from './utils/bundleOptimizer'
import { initializePerformanceOptimizations } from './utils/performanceOptimizer'

// Initialize performance optimizations
initializeBundleOptimizations();
initializePerformanceOptimizations();

createRoot(document.getElementById("root")!).render(<App />);
