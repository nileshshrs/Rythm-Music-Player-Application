import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { MusicContextProvider } from './context/MusicContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MusicContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MusicContextProvider>
  </StrictMode>,
)
