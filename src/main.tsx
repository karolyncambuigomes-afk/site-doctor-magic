import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/cleanConsole.ts'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Trigger prerender event after app is mounted
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    document.dispatchEvent(new Event('render-event'));
  });
}

