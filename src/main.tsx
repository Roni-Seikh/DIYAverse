import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { DiyaProvider } from './lib/DiyaContext'
import { ToastProvider } from './components/Toast'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <DiyaProvider>
          <App />
        </DiyaProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
