import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx starting...');
console.log('Environment:', import.meta.env.MODE);

createRoot(document.getElementById("root")!).render(<App />);

console.log('Main.tsx rendered!');
