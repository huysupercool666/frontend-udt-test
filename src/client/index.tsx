import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const domNode = document.getElementById('root')

if (!domNode) {
  throw new Error('Root element not found')
}

hydrateRoot(
  domNode,
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
