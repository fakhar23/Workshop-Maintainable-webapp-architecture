import { useState } from 'react'
import PlaceOrderPage from './pages/PlaceOrderPage.jsx'
import ContactSupportPage from './pages/ContactSupportPage.jsx'

function App() {
  const [page, setPage] = useState('order')

  return (
    <main className="app">
      <h1>Wrapper Pattern Workshop</h1>

      <nav className="nav">
        <button type="button" onClick={() => setPage('order')}>
          Place Order
        </button>
        <button type="button" onClick={() => setPage('support')}>
          Contact Support
        </button>
      </nav>

      {page === 'order' ? <PlaceOrderPage /> : <ContactSupportPage />}
    </main>
  )
}

export default App
