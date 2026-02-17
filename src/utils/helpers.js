/** Format number as Indian Rupees */
export const fmt = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })

/** Format date nicely */
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

/** Short unique id */
export const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase()

/** Today as YYYY-MM-DD */
export const today = () => new Date().toISOString().slice(0, 10)

/** N days from today as YYYY-MM-DD */
export const daysFromToday = (n) =>
  new Date(Date.now() + n * 86400000).toISOString().slice(0, 10)

/** Calculate invoice totals from items + discount */
export const calcTotals = (items = [], discount = 0) => {
  const subTotal = items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0)
  const taxTotal = items.reduce(
    (s, it) => s + (it.qty || 0) * (it.price || 0) * ((it.tax || 0) / 100),
    0
  )
  const total = subTotal + taxTotal - (discount || 0)
  return { subTotal, taxTotal, total: Math.max(0, total) }
}
