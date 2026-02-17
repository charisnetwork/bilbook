import { useState } from 'react'
import { COLORS } from '../constants.js'
import { fmt, uid } from '../utils/helpers.js'
import { Card, Btn, Input, PageHeader, Empty } from './UI.jsx'

const blankForm = () => ({ id: '', name: '', phone: '', email: '', gst: '', address: '', openingBalance: 0 })

export default function Customers({ data, onDataChange }) {
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState(blankForm())
  const [search,   setSearch]   = useState('')

  const customers = data.customers || []

  const filtered = customers.filter(c =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const openAdd = () => { setForm(blankForm()); setShowForm(true) }
  const openEdit = (c) => { setForm(c); setShowForm(true) }

  const save = () => {
    if (!form.name.trim()) return alert('Customer name is required')
    const list = form.id
      ? customers.map(c => c.id === form.id ? form : c)
      : [...customers, { ...form, id: uid(), openingBalance: +form.openingBalance || 0 }]
    onDataChange({ ...data, customers: list })
    setShowForm(false)
    setForm(blankForm())
  }

  const del = (id) => {
    if (!confirm('Delete this customer? Their invoices will remain.')) return
    onDataChange({ ...data, customers: customers.filter(c => c.id !== id) })
  }

  // Stats per customer
  const getStats = (name) => {
    const invs = (data.invoices || []).filter(i => i.customer === name && i.status !== 'draft' && (i.type || 'sale') === 'sale')
    return {
      invoices: invs.length,
      total: invs.reduce((s, i) => s + (i.total || 0), 0),
      due:   invs.filter(i => i.status !== 'paid').reduce((s, i) => s + ((i.total || 0) - (i.paid || 0)), 0),
    }
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers`}
        action={<Btn onClick={openAdd}>+ Add Customer</Btn>}
      />

      {showForm && (
        <Card style={{ marginBottom: 16, border: `2px solid ${COLORS.accent}` }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>
            {form.id ? 'Edit' : 'Add'} Customer
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
            <Input label="Full Name *"    value={form.name}    onChange={v => setF('name', v)} required />
            <Input label="Phone"          value={form.phone}   onChange={v => setF('phone', v)} />
            <Input label="Email"          value={form.email}   onChange={v => setF('email', v)} />
            <Input label="GST Number"     value={form.gst}     onChange={v => setF('gst', v)} />
            <Input label="Opening Balance (₹)" type="number" value={form.openingBalance} onChange={v => setF('openingBalance', v)} />
            <Input label="Address"        value={form.address} onChange={v => setF('address', v)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={save}>{form.id ? 'Update' : 'Save Customer'}</Btn>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setForm(blankForm()) }}>Cancel</Btn>
          </div>
        </Card>
      )}

      <Card>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customers by name, phone or email..."
          style={{ width: '100%', border: `1.5px solid ${COLORS.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 14 }}
        />

        {filtered.length === 0 ? (
          <Empty icon="👥" title="No customers yet" subtitle="Add your first customer to start billing" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
            {filtered.map(c => {
              const stats = getStats(c.name)
              return (
                <div key={c.id} style={{ border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: 16, background: COLORS.bg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: COLORS.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👤</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Btn size="sm" variant="ghost"  onClick={() => openEdit(c)}>Edit</Btn>
                      <Btn size="sm" variant="danger" onClick={() => del(c.id)}>Del</Btn>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 4 }}>{c.name}</div>
                  {c.phone   && <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 2 }}>📞 {c.phone}</div>}
                  {c.email   && <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 2 }}>✉️ {c.email}</div>}
                  {c.gst     && <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 2 }}>GST: {c.gst}</div>}
                  {c.address && <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 2 }}>📍 {c.address}</div>}

                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>Invoices</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{stats.invoices}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>Total Billed</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.accent }}>{fmt(stats.total)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>Due</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: stats.due > 0 ? COLORS.red : COLORS.green }}>{fmt(stats.due)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
