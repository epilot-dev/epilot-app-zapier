import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppBridgeProvider } from './AppBridgeProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EpilotThemeProvider } from '@epilot/core-ui';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AppBridgeProvider>
        <QueryClientProvider client={queryClient}>
          <EpilotThemeProvider theme="light">
            <App />
          </EpilotThemeProvider>
        </QueryClientProvider>
      </AppBridgeProvider>
  </StrictMode>,
)
