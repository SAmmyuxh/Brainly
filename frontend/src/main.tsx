import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from 'sonner'
import { ErrorBoundary } from './components/ErrorBoundary'

const client = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={client}>
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </StrictMode>
  </QueryClientProvider>,
)

