import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { MusicContextProvider } from './context/MusicContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'



export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    },
  },
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MusicContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MusicContextProvider>
    </QueryClientProvider>
  </StrictMode>,
)
