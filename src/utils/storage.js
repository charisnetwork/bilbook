const STORE_KEY = 'billbook_data_v1'

export const defaultData = () => ({
  invoices: [],
  customers: [],
  products: [],
  expenses: [],
  settings: {
    businessName: 'My Business',
    gst: '',
    phone: '',
    address: '',
    email: '',
    currency: '₹',
  },
})

export const loadData = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? JSON.parse(raw) : defaultData()
  } catch {
    return defaultData()
  }
}

export const saveData = (data) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Storage error', e)
  }
}

export const clearData = () => {
  if (window.confirm('⚠️ This will delete ALL your data permanently. Are you sure?')) {
    localStorage.removeItem(STORE_KEY)
    window.location.reload()
  }
}
