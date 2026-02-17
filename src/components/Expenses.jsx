import { useState } from 'react'
import { COLORS, EXPENSE_CATEGORIES, PAYMENT_MODES } from '../constants.js'
import { fmt, fmtDate, uid, today } from '../utils/helpers.js'
import { Card, Btn, Input, Select, PageHeader, Empty, TableHead } from './UI.jsx'

const blankForm = () => ({ id: '', date: today(), category: 'Office', desc: '', amount: '', payMode: 'Cash', reference: '' })

export default function Expenses({ data, onDataChange }) {
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState(blankForm())
  const [search,   setSearch]   = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const expenses = data.expenses || []
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const filtered = expenses.filter(e =>
    (filterCat === 'all' || e.category === filterCat) &&
    (!search || e.desc?.toLowerCase().includes(search.toLowerCase()) || e.category?.toLowerCase().includes(search.toLowerCase()))
  )

  const total = filtered.reduce((s, e) => s + (e.amount || 0), 0)

  const openAdd  = () => { setForm(blankForm()); setShowForm(true) }
  const openEdit = (e) => { setForm(e); setShowForm(true) }

  const save = () => {
    if (!form.amount || +form.amount <= 0) return alert('Enter a valid amount')
    const list = form.id
      ? expenses.map(e => e.id === form.id ? { ...form, amount: +form.amount } : e)
      : [...expenses, { ...form, id: uid(), amount: +form.amount }]
    onDataChange({ ...data, expenses: list })
    setShowForm(false)
    setForm(blankForm())
  }

  const del = (id) => {
    if (!confirm('Delete this expense?')) return
    onDataChange({ ...data, expenses: expenses.filter(e => e.id !== id) })
  }

  // Category totals for chart
  const catTotals = EXPENSE_CATEGORIES.reduce((acc, c) => {
    acc[c] = expenses.filter(e => e.category === c).reduce((s, e) => s + (e.amount || 0), 0)
    return acc
  }, {})
  const grandTotal = Object.values(catTotals).reduce((s, v) => s + v, 0)

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle={`Total: ${fmt(grandTotal)}`}
        action={<Btn onClick={openAdd}>+ Add Expense</Btn>}
      />

      {showForm && (
        <Card style={{ marginBottom: 16, border: `2px solid ${COLORS.accent}` }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>
            {form.id ? 'Edit' : 'Add'} Expense
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 14 }}>
            <Input label="Date"          type="date" value={form.date}   onChange={v => setF('date', v)} />
            <Select label="Category"     value={form.category}           onChange={v => setF('category', v)} options={EXPENSE_CATEGORIES.map(c => ({ value: c, label: c }))} />
            <Input label="Description"   value={form.desc}               onChange={v => setF('desc', v)} placeholder="What was this for?" />
            <Input label="Amount (₹) *"  type="number" value={form.amount} onChange={v => setF('amount', v)} required />
            <Select label="Payment Mode" value={form.payMode}            onChange={v => setF('payMode', v)} options={PAYMENT_MODES.map(m => ({ value: m, label: m }))} />
            <Input label="Reference #"   value={form.reference}          onChange={v => setF('reference', v)} placeholder="Receipt / bill no." />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={save}>{form.id ? 'Update' : 'Save Expense'}</Btn>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setForm(blankForm()) }}>Cancel</Btn>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 0 }}>
        {/* Category breakdown */}
        <Card>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>By Category</h4>
          {grandTotal === 0 ? (
            <div style={{ color: COLORS.muted, fontSize: 13 }}>No expenses recorded yet.</div>
          ) : (
            EXPENSE_CATEGORIES.filter(c => catTotals[c] > 0).map(c => {
              const pct = grandTotal > 0 ? (catTotals[c] / grandTotal * 100) : 0
              return (
                <div key={c} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{c}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.red }}>{fmt(catTotals[c])}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: COLORS.border }}>
                    <div style={{ height: '100%', borderRadius: 3, background: COLORS.accent, width: `${pct}%`, transition: 'width .4s' }} />
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 1 }}>{pct.toFixed(1)}%</div>
                </div>
              )
            })
          )}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1.5px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
            <span style={{ fontSize: 13 }}>Total</span>
            <span style={{ color: COLORS.red }}>{fmt(grandTotal)}</span>
          </div>
        </Card>

        {/* List */}
        <Card>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..."
              style={{ flex: 1, border: `1.5px solid ${COLORS.border}`, borderRadius: 8, padding: '7px 12px', fontSize: 13 }} />
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              style={{ border: `1.5px solid ${COLORS.border}`, borderRadius: 8, padding: '7px 12px', fontSize: 13 }}>
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <Empty icon="💸" title="No expenses yet" subtitle="Track your business expenses here" />
          ) : (
            <>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8, fontWeight: 600 }}>
                Showing {filtered.length} records — Total: {fmt(total)}
              </div>
              <div style={{ overflowX: 'auto', maxHeight: 420, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <TableHead cols={['Date', 'Category', 'Description', 'Mode', 'Amount', '']} />
                  <tbody>
                    {[...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).map(e => (
                      <tr key={e.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: '9px 8px', color: COLORS.muted, whiteSpace: 'nowrap' }}>{fmtDate(e.date)}</td>
                        <td style={{ padding: '9px 8px' }}>
                          <span style={{ background: COLORS.amberLight, color: '#92400E', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{e.category}</span>
                        </td>
                        <td style={{ padding: '9px 8px' }}>{e.desc || '—'}</td>
                        <td style={{ padding: '9px 8px', color: COLORS.muted }}>{e.payMode}</td>
                        <td style={{ padding: '9px 8px', fontWeight: 700, color: COLORS.red }}>{fmt(e.amount)}</td>
                        <td style={{ padding: '9px 8px' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <Btn size="sm" variant="ghost"  onClick={() => openEdit(e)}>✏️</Btn>
                            <Btn size="sm" variant="danger" onClick={() => del(e.id)}>✕</Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
