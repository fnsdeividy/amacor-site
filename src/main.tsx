import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initPostHog } from './lib/posthog'

// Inicializa o PostHog antes de montar o React para garantir que
// o primeiro $pageview seja capturado corretamente.
initPostHog()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
