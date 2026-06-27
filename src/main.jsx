import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const STORE_KEY = 'learning-os-storage'
const STORE_VERSION = 'v2'
const stored = localStorage.getItem(STORE_KEY)
if (stored) {
  const parsed = JSON.parse(stored)
  if (!parsed.state?.version || parsed.state.version !== STORE_VERSION) {
    localStorage.removeItem(STORE_KEY)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
