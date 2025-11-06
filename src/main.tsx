import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './utils/seoOptimizations'

// Performance monitoring
const startTime = performance.now();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Log performance metrics
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log(`App loaded in ${loadTime.toFixed(2)}ms`);
  
  // Report Core Web Vitals
  if ('web-vital' in window) {
    // This would integrate with actual web vitals library in production
    console.log('Ready for Core Web Vitals tracking');
  }
})
