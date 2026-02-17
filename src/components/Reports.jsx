import { COLORS } from '../constants.js'
import { fmt, fmtDate } from '../utils/helpers.js'
import { Card, StatCard } from './UI.jsx'

export default function Reports({ data }) {
  const invoices = data.invoices || []
  const expenses = data.expenses || []
  const saleInvoices = invoices.filter(i => (i.type || 'sale') === 'sale')

  const totalRevenue  = saleInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0)
  const totalDue      = saleInvoices.filter(i => i.status !== 'paid' && i.status !== 'draft').reduce((s, i) => s + ((i.total || 0) - (i.paid || 0)), 0)
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0)
  const netProfit     = totalRevenue - totalExpenses

  // Monthly data
  const months = {}
  saleInvoices.forEach(inv => {
    if (inv.status === 'draft') return
    const m = inv.date?.slice(0, 7)
    if (!m) return
    if (!months[m]) months[m] = { sales: 0, received: 0, expenses: 0 }
    months[m].sales += inv.total || 0
    if (inv.status === 'paid') months[m].received += inv.total || 0
  })
  expenses.forEach(exp => {
    const m = exp.date?.slice(0, 7)
    if (!m) return
    if (!months[m]) months[m] = { sales: 0, received: 0, expenses: 0 }
    months[m].expenses += exp.amount || 0
  })
  const sortedMonths = Object.keys(months).sort().slice(-12)

  // Customer totals
  const custMap = {}
  saleInvoices.filter(i => i.status !== 'draft').forEach(inv => {
    if (!inv.customer) return
    if (!custMap[inv.customer]) custMap[inv.customer] = { total: 0, paid: 0, invoices: 0 }
    custMap[inv.customer].total    += inv.total || 0
    custMap[inv.customer].invoices += 1
    if (inv.status === 'paid') custMap[inv.customer].paid += inv.total || 0
  })
  const topCustomers = Object.entries(custMap).sort((a, b) => b[1].total - a[1].total).slice(0, 8)

  // Status distribution
  const statusCount = { paid: 0, unpaid: 0, partial: 0, draft: 0 }
  saleInvoices.forEach(i => { statusCount[i.status] = (statusCount[i.status] || 0) + 1 })

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Reports & Analytics</h1>
        <p style={{ color: COLORS.muted, fontSize: 13, margin: '3px 0 0' }}>Business performance overview</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard label="Total Revenue"   value={fmt(totalRevenue)}  icon="💰" color={COLORS.green}  bg={COLORS.greenLight} />
        <StatCard label="Amount Due"      value={fmt(totalDue)}      icon="⏳" color={COLORS.red}    bg={COLORS.redLight} />
        <StatCard label="Total Expenses"  value={fmt(totalExpenses)} icon="💸" color={COLORS.amber}  bg={COLORS.amberLight} />
        <StatCard label="Net Profit"      value={fmt(netProfit)}     icon="📊" color={netProfit >= 0 ? COLORS.green : COLORS.red} bg={netProfit >= 0 ? COLORS.greenLight : COLORS.redLight} />
      </div>

      {/* Invoice status overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <h4 style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 14 }}>Invoice Status</h4>
          {Object.entries(statusCount).filter(([, v]) => v > 0).map(([k, v]) => {
            const colors = { paid: COLORS.green, unpaid: COLORS.red, partial: COLORS.amber, draft: COLORS.muted }
            const bgs    = { paid: COLORS.greenLight, unpaid: COLORS.redLight, partial: COLORS.amberLight, draft: COLORS.border }
            return (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[k] }} />
                  <span style={{ fontSize: 13, textTransform: 'capitalize', fontWeight: 500 }}>{k}</span>
                </div>
                <span style={{ background: bgs[k], color: colors[k], padding: '2px 10px', borderRadius: 20, fontWeight: 700, fontSize: 12 }}>{v}</span>
              </div>
            )
          })}
          {saleInvoices.length === 0 && <div style={{ color: COLORS.muted, fontSize: 13 }}>No invoices yet</div>}
        </Card>

        <Card>
          <h4 style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 14 }}>Monthly Summary (Last 12 months)</h4>
          {sortedMonths.length === 0 ? (
            <div style={{ color: COLORS.muted, fontSize: 13, textAlign: 'center', padding: '30px 0' }}>No data available yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `1.5px solid ${COLORS.border}` }}>
                    {['Month', 'Sales Billed', 'Received', 'Expenses', 'Profit'].map(h => (
                      <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: COLORS.muted, fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedMonths.map(m => {
                    const d = months[m]
                    const profit = (d.received || 0) - (d.expenses || 0)
                    return (
                      <tr key={m} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: '8px' }}>
                          {new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '8px', fontWeight: 600 }}>{fmt(d.sales)}</td>
                        <td style={{ padding: '8px', color: COLORS.green, fontWeight: 600 }}>{fmt(d.received || 0)}</td>
                        <td style={{ padding: '8px', color: COLORS.red,   fontWeight: 600 }}>{fmt(d.expenses || 0)}</td>
                        <td style={{ padding: '8px', fontWeight: 700, color: profit >= 0 ? COLORS.green : COLORS.red }}>{fmt(profit)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <h4 style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 14 }}>Top Customers by Revenue</h4>
        {topCustomers.length === 0 ? (
          <div style={{ color: COLORS.muted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No customer data yet</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${COLORS.border}` }}>
                {['Rank', 'Customer', 'Invoices', 'Total Billed', 'Received', 'Pending'].map(h => (
                  <th key={h} style={{ padding: '7px 8px', textAlign: 'left', color: COLORS.muted, fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topCustomers.map(([name, s], i) => (
                <tr key={name} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '9px 8px' }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: i < 3 ? COLORS.accent : COLORS.border, color: i < 3 ? '#fff' : COLORS.muted, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                  </td>
                  <td style={{ padding: '9px 8px', fontWeight: 600 }}>{name}</td>
                  <td style={{ padding: '9px 8px', color: COLORS.muted }}>{s.invoices}</td>
                  <td style={{ padding: '9px 8px', fontWeight: 700, color: COLORS.accent }}>{fmt(s.total)}</td>
                  <td style={{ padding: '9px 8px', color: COLORS.green, fontWeight: 600 }}>{fmt(s.paid)}</td>
                  <td style={{ padding: '9px 8px', color: COLORS.red, fontWeight: 600 }}>{fmt(s.total - s.paid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
