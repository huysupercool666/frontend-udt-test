import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppCalculator from './appCalculator/AppCalculator'
import HistoryPage from './historyPage/HistoryPage'
import '../styles/app.scss'

const domNode = document.getElementById('root')

if (!domNode) {
  throw new Error('Root element not found')
}

hydrateRoot(
  domNode,
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<AppCalculator />} />
      <Route path='/HistoryPage' element={<HistoryPage />} />
    </Routes>
  </BrowserRouter>
)
