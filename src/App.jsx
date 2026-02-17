import { useState, useEffect, useCallback } from 'react'
import { loadData, saveData } from './utils/storage.js'
import Sidebar    from './components/Sidebar.jsx'
import Dashboard  from './components/Dashboard.jsx'
import InvoicesList from './components/InvoicesList.jsx'
import Customers  from './components/Customers.jsx'
import Products   from './components/Products.jsx'
import Expenses   from './components/Expenses.jsx'
import Reports    from './components/Reports.jsx'
import Settings   from './components/Settings.jsx'

export default function App() {
  const [view,    setView]    = useState('dashboard')
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const d = loadData()
    setData(d)
    setLoading(false)
  }, [])

  const handleDataChange = useCallback((newData) => {
    setData(newData)
    saveData(newData)
  }, [])

  if (loading || !data) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: 12,
        fontFamily: 'Segoe UI, sans-serif', color: '#1A2744',
      }}>
        <div style={{ fontSize: 48 }}>📒</div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Loading BillBook...</div>
      </div>
    )
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard     data={data} setView={setView} />
      case 'invoices':  return <InvoicesList  data={data} onDataChange={handleDataChange} type="sale" />
      case 'purchases': return <InvoicesList  data={data} onDataChange={handleDataChange} type="purchase" />
      case 'customers': return <Customers     data={data} onDataChange={handleDataChange} />
      case 'products':  return <Products      data={data} onDataChange={handleDataChange} />
      case 'expenses':  return <Expenses      data={data} onDataChange={handleDataChange} />
      case 'reports':   return <Reports       data={data} />
      case 'settings':  return <Settings      data={data} onDataChange={handleDataChange} />
      default:          return <Dashboard     data={data} setView={setView} />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F8FC' }}>
      <Sidebar view={view} setView={setView} bizName={data.settings?.businessName} />
      <main style={{ marginLeft: 220, flex: 1, padding: '28px 32px', minHeight: '100vh' }}>
        {renderView()}
      </main>
    </div>
  )
}
