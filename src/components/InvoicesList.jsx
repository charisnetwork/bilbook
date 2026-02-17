import { useState } from 'react'
import { COLORS } from '../constants.js'
import { fmt, fmtDate } from '../utils/helpers.js'
import { Card, Btn, StatusBadge, PageHeader, Empty } from './UI.jsx'
import InvoiceForm from './InvoiceForm.jsx'
import InvoiceView from './InvoiceView.jsx'

export default function InvoicesList({ data, onDataChange, type = 'sale' }) {
  const [mode,        setMode]       = useState('list')   // list | form | view
  const [editInv,     setEditInv]    = useState(null)
  const [viewInv,     setViewInv]    = useState(null)
  const [search,      setSearch]     = useState('')
  const [filterStatus,setFilterStatus] = useState('all')

  const invoices = (data.invoices || []).filter(i => (i.type || 'sale') === type)

  const filtered = invoices.filter(inv => {
    const matchSearch = !search ||
      inv.number?.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus
    return matchSearch && matchStatus
  })

  const saveInvoice = (inv) => {
    const exists = (data.invoices || []).find(i => i.id === inv.id)
    const list   = exists
      ? (data.invoices || []).map(i => i.id === inv.id ? inv : i)
      : [...(data.invoices || []), inv]
    onDataChange({ ...data, invoices: list })
    setMode('list'); setEditInv(null)
  }

  const deleteInv = (id) => {
    if (!confirm('Delete this record permanently?')) return
    onDataChange({ ...data, invoices: (data.invoices || []).filter(i => i.id !== id) })
  }

  const markPaid = (id) => {
    onDataChange({
      ...data,
      invoices: (data.invoices || []).map(i =>
        i.id === id ? { ...i, status: 'paid', paid: i.total } : i
      ),
    })
  }

  if (mode === 'form') {
    return <InvoiceForm data={data} onSave={saveInvoice} onCancel={() => { setMode('list'); setEditInv(null) }} editInv={editInv} type={type} />
  }
  if (mode === 'view' && viewInv) {
    return <InvoiceView inv={viewInv} onBack={() => setMode('list')} settings={data.settings} />
  }

  const title    = type === 'sale' ? 'Sales & Invoices' : 'Purchase Bills'
  const icon     = type === 'sale' ? '🧾' : '📦'
  const btnLabel = type === 'sale' ? '+ New Invoice' : '+ New Purchase'

  // Summary cards
  const total     = filtered.reduce((s, i) => s + (i.total || 0), 0)
  const totalPaid = filtered.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0)
  const totalDue  = filtered.filter(i => i.status === 'unpaid' || i.status === 'partial').reduce((s, i) => s + ((i.total || 0) - (i.paid || 0)), 0)

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={`${invoices.length} records`}
        action={<Btn variant="primary" onClick={() => { setEditInv(null); setMode('form') }}>{btnLabel}</Btn>}
      />

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
        {[
          { l: 'Total Amount', v: fmt(total),     c: COLORS.accent },
          { l: 'Received',     v: fmt(totalPaid), c: COLORS.green  },
          { l: 'Due',          v: fmt(totalDue),  c: COLORS.red    },
        ].map(s => (
          <div key={s.l} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      <Card>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by invoice # or name..."
            style={{ flex: 1, border: `1.5px solid ${COLORS.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 13 }}
          />
          {['all', 'paid', 'unpaid', 'partial', 'draft'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${filterStatus === s ? COLORS.accent : COLORS.border}`,
                background: filterStatus === s ? COLORS.accentLight : '#fff',
                color: filterStatus === s ? COLORS.accent : COLORS.muted,
                fontWeight: 600, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize',
              }}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Empty icon={icon} title={`No ${type === 'sale' ? 'invoices' : 'purchases'} found`} subtitle="Create your first record to get started" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${COLORS.border}` }}>
                  {['Invoice #', 'Customer', 'Date', 'Due Date', 'Amount', 'Paid', 'Balance', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px', color: COLORS.muted, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).map(inv => (
                  <tr key={inv.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '10px 8px' }}>
                      <span onClick={() => { setViewInv(inv); setMode('view') }} style={{ fontWeight: 700, color: COLORS.accent, cursor: 'pointer', textDecoration: 'none' }}>
                        #{inv.number}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', fontWeight: 500 }}>{inv.customer}</td>
                    <td style={{ padding: '10px 8px', color: COLORS.muted, whiteSpace: 'nowrap' }}>{fmtDate(inv.date)}</td>
                    <td style={{ padding: '10px 8px', color: COLORS.muted, whiteSpace: 'nowrap' }}>{fmtDate(inv.dueDate)}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>{fmt(inv.total)}</td>
                    <td style={{ padding: '10px 8px', color: COLORS.green, fontWeight: 600 }}>{fmt(inv.paid || 0)}</td>
                    <td style={{ padding: '10px 8px', color: COLORS.red, fontWeight: 600 }}>{fmt((inv.total || 0) - (inv.paid || 0))}</td>
                    <td style={{ padding: '10px 8px' }}><StatusBadge status={inv.status} /></td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap' }}>
                        <Btn size="sm" variant="subtle" onClick={() => { setViewInv(inv); setMode('view') }}>View</Btn>
                        <Btn size="sm" variant="ghost"  onClick={() => { setEditInv(inv); setMode('form') }}>Edit</Btn>
                        {inv.status !== 'paid' && <Btn size="sm" variant="success" onClick={() => markPaid(inv.id)}>Paid ✓</Btn>}
                        <Btn size="sm" variant="danger" onClick={() => deleteInv(inv.id)}>Del</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
