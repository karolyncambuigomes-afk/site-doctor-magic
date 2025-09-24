import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Defer non-critical initializations to idle time
if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(() => {
    import('./utils/performanceOptimizer').then(m => m.initializePerformanceOptimizations?.());
    import('./utils/bundleOptimizer').then(m => m.initializeBundleOptimizations?.());
  });
}

createRoot(document.getElementById("root")!).render(<App />);
