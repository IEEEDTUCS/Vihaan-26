import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Analytics } from "@vercel/analytics/react"

// Service worker registration is handled automatically by VitePWA with registerType: 'autoUpdate'
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // console.log('✅ Service Worker support detected - VitePWA will handle registration');
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
