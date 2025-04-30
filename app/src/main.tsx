import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppBridgeProvider } from './AppBridgeProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBridgeProvider>
      <App />
    </AppBridgeProvider>
  </StrictMode>,
)
