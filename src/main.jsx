import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Register service worker (from public/sw.js) safely
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  try{
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(()=>{})
    })
  }catch(e){}
}

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = createRoot(rootEl)
  try{ root.render(<App />) }catch(e){ console.error('Render error', e) }
}
