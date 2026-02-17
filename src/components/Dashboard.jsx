import { COLORS } from '../constants.js'
import { fmt, fmtDate } from '../utils/helpers.js'
import { Card, StatCard, Btn, StatusBadge } from './UI.jsx'

export default function Dashboard({ data, setView }) {
  const invoices = data.invoices || []
  const expenses = data.expenses || []

  const totalSales    = invoices.filter(i => i.status !== 'draft').reduce((s, i) => s + (i.total || 0), 0)
  const totalReceived = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0)
  const totalDue      = invoices.filter(i => i.status === 'unpaid' || i.status === 'partial')
                                .reduce((s, i) => s + ((i.total || 0) - (i.paid || 0)), 0)
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0)

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  const stats = [
    { label: 'Total Sales',      value: fmt(totalSales),    icon: '📈', color: COLORS.accent, bg: COLORS.accentLight },
    { label: 'Amount Received',  value: fmt(totalReceived), icon: '✅', color: COLORS.green,  bg: COLORS.greenLight },
    { label: 'Amount Due',       value: fmt(totalDue),      icon: '⏳', color: COLORS.red,    bg: COLORS.redLight },
    { label: 'Total Expenses',   value: fmt(totalExpenses), icon: '💸', color: COLORS.amber,  bg: COLORS.amberLight },
  ]

  const quickActions = [
    { icon: '➕', label: 'New Sale Invoice',  view: 'invoices' },
    { icon: '📦', label: 'New Purchase Bill', view: 'purchases' },
    { icon: '👤', label: 'Add Customer',      view: 'customers' },
    { icon: '💸', label: 'Record Expense',    view: 'expenses' },
    { icon: '🏷️', label: 'Add Product',       view: 'products' },
    { icon: '📊', label: 'View Reports',      view: 'reports' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.text, margin: 0 }}>Dashboard</h1>
        <p style={{ color: COLORS.muted, fontSize: 14, margin: '4px 0 0' }}>
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick actions + recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: COLORS.text }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickActions.map(a => (
              <div
                key={a.label}
                onClick={() => setView(a.view)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.border}`,
                  cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  color: COLORS.text,
                  background: COLORS.bg,
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all .12s',
                }}
              >
                <span>{a.icon}</span>{a.label}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Recent Invoices</h3>
            <Btn size="sm" variant="ghost" onClick={() => setView('invoices')}>View All</Btn>
          </div>

          {recentInvoices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: COLORS.muted, fontSize: 13 }}>
              No invoices yet. Create your first one!
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${COLORS.border}` }}>
                  {['Invoice #', 'Customer', 'Date', 'Amount', 'Balance', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: COLORS.muted, fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '9px 8px', fontWeight: 700, color: COLORS.accent }}>#{inv.number}</td>
                    <td style={{ padding: '9px 8px' }}>{inv.customer || '—'}</td>
                    <td style={{ padding: '9px 8px', color: COLORS.muted }}>{fmtDate(inv.date)}</td>
                    <td style={{ padding: '9px 8px', fontWeight: 700 }}>{fmt(inv.total)}</td>
                    <td style={{ padding: '9px 8px', color: COLORS.red, fontWeight: 600 }}>
                      {fmt((inv.total || 0) - (inv.paid || 0))}
                    </td>
                    <td style={{ padding: '9px 8px' }}><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  )
}
