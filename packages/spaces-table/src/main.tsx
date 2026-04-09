import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mirohq/design-system'
import './index.css'
import { App } from './App'
import { ButtonLab } from './components/lab/ButtonLab'

const isLab = new URLSearchParams(window.location.search).has('lab')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider root>
      {isLab ? <ButtonLab /> : <App />}
    </ThemeProvider>
  </StrictMode>,
)
