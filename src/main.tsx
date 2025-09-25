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

