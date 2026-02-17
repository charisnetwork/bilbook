import { useState } from 'react'
import { COLORS, TAX_RATES } from '../constants.js'
import { uid, today, daysFromToday, calcTotals, fmt } from '../utils/helpers.js'
import { Card, Btn, Input, Select } from './UI.jsx'

export default function InvoiceForm({ data, onSave, onCancel, editInv = null, type = 'sale' }) {
  const invCount = (data.invoices || []).filter(i => i.type === type).length
  const prefix   = type === 'sale' ? 'INV' : 'PUR'

  const [form, setForm] = useState(
    editInv || {
      id: uid(),
      number: `${prefix}-${String(invCount + 1).padStart(4, '0')}`,
      date: today(),
      dueDate: daysFromToday(15),
      customer: '',
      customerPhone: '',
      customerGST: '',
      billingAddr: '',
      items: [{ id: uid(), desc: '', qty: 1, price: 0, tax: 0, unit: 'pcs' }],
      discount: 0,
      notes: '',
      status: 'unpaid',
      paid: 0,
    }
  )

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const setItem = (i, k, v) => {
    const items = [...form.items]
    items[i] = { ...items[i], [k]: v }
    setForm(p => ({ ...p, items }))
  }

  const addItem  = () => setForm(p => ({ ...p, items: [...p.items, { id: uid(), desc: '', qty: 1, price: 0, tax: 0, unit: 'pcs' }] }))
  const delItem  = (i) => setForm(p => ({ ...p, items: p.items.filter((_, j) => j !== i) }))

  const { subTotal, taxTotal, total } = calcTotals(form.items, form.discount)

  const handleSave = (status) => {
    if (!form.customer.trim()) return alert('Customer name is required')
    if (form.items.some(it => !it.desc.trim())) return alert('All item descriptions are required')
    onSave({ ...form, type, status: status || form.status, subTotal, taxTotal, total })
  }

  // Autofill from existing customer
  const customers = data.customers || []
  const handleCustomerChange = (val) => {
    set('customer', val)
    const match = customers.find(c => c.name.toLowerCase() === val.toLowerCase())
    if (match) {
      setForm(p => ({ ...p, customer: match.name, customerPhone: match.phone || '', customerGST: match.gst || '', billingAddr: match.address || '' }))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <Btn variant="ghost" size="sm" onClick={onCancel}>← Back</Btn>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
          {editInv ? 'Edit' : 'New'} {type === 'sale' ? 'Sale Invoice' : 'Purchase Bill'}
        </h2>
      </div>

      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, color: COLORS.text }}>Invoice Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <Input label="Invoice #" value={form.number} onChange={v => set('number', v)} />
            <Input label="Invoice Date" type="date" value={form.date} onChange={v => set('date', v)} />
            <Input label="Due Date"     type="date" value={form.dueDate} onChange={v => set('dueDate', v)} />
          </div>
        </Card>

        <Card>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, color: COLORS.text }}>
            {type === 'sale' ? 'Bill To' : 'Supplier'}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <Input label="Name *" value={form.customer} onChange={handleCustomerChange} placeholder="Customer / Supplier name" required />
              {/* Dropdown suggestions */}
              {form.customer && customers.filter(c => c.name.toLowerCase().includes(form.customer.toLowerCase()) && c.name !== form.customer).length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: `1.5px solid ${COLORS.accent}`, borderRadius: 8, zIndex: 50, maxHeight: 160, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}>
                  {customers
                    .filter(c => c.name.toLowerCase().includes(form.customer.toLowerCase()))
                    .slice(0, 5)
                    .map(c => (
                      <div key={c.id} onClick={() => handleCustomerChange(c.name)}
                        style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13, borderBottom: `1px solid ${COLORS.border}` }}>
                        <strong>{c.name}</strong>
                        {c.phone && <span style={{ color: COLORS.muted, marginLeft: 8 }}>{c.phone}</span>}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <Input label="Phone" value={form.customerPhone} onChange={v => set('customerPhone', v)} placeholder="Phone" />
          </div>
        </Card>
      </div>

      {/* Items Table */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ margin: 0, fontSize: 14, color: COLORS.text }}>Items / Services</h4>
          <Btn size="sm" variant="subtle" onClick={addItem}>+ Add Row</Btn>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${COLORS.border}` }}>
                {['#', 'Description', 'Qty', 'Unit', 'Rate (₹)', 'Tax', 'Amount', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 7px', color: COLORS.muted, fontWeight: 700, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.items.map((it, i) => {
                const amt    = (it.qty || 0) * (it.price || 0)
                const taxAmt = amt * ((it.tax || 0) / 100)
                return (
                  <tr key={it.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '5px 7px', color: COLORS.muted, width: 28 }}>{i + 1}</td>
                    <td style={{ padding: '4px 7px' }}>
                      <input value={it.desc} onChange={e => setItem(i, 'desc', e.target.value)}
                        placeholder="Item description"
                        style={{ border: `1.5px solid ${COLORS.border}`, borderRadius: 6, padding: '6px 8px', width: '100%', fontSize: 13, minWidth: 160 }} />
                    </td>
                    <td style={{ padding: '4px 7px', width: 70 }}>
                      <input type="number" min="0" value={it.qty} onChange={e => setItem(i, 'qty', +e.target.value)}
                        style={{ border: `1.5px solid ${COLORS.border}`, borderRadius: 6, padding: '6px 8px', width: '100%', fontSize: 13 }} />
                    </td>
                    <td style={{ padding: '4px 7px', width: 70 }}>
                      <input value={it.unit} onChange={e => setItem(i, 'unit', e.target.value)}
                        style={{ border: `1.5px solid ${COLORS.border}`, borderRadius: 6, padding: '6px 8px', width: '100%', fontSize: 13 }} />
                    </td>
                    <td style={{ padding: '4px 7px', width: 110 }}>
                      <input type="number" min="0" value={it.price} onChange={e => setItem(i, 'price', +e.target.value)}
                        style={{ border: `1.5px solid ${COLORS.border}`, borderRadius: 6, padding: '6px 8px', width: '100%', fontSize: 13 }} />
                    </td>
                    <td style={{ padding: '4px 7px', width: 80 }}>
                      <select value={it.tax} onChange={e => setItem(i, 'tax', +e.target.value)}
                        style={{ border: `1.5px solid ${COLORS.border}`, borderRadius: 6, padding: '6px 8px', width: '100%', fontSize: 13 }}>
                        {TAX_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '6px 7px', fontWeight: 700, width: 90, color: COLORS.text }}>{fmt(amt + taxAmt)}</td>
                    <td style={{ padding: '4px 7px', width: 28 }}>
                      {form.items.length > 1 && (
                        <span onClick={() => delItem(i)} style={{ cursor: 'pointer', color: COLORS.red, fontSize: 18, lineHeight: 1 }}>×</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Totals block */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <div style={{ width: 290, background: COLORS.bg, borderRadius: 10, padding: '14px 16px', fontSize: 13 }}>
            {[
              { l: 'Sub Total', v: subTotal, muted: true },
              { l: 'Tax Total', v: taxTotal, muted: true },
            ].map(r => (
              <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, color: COLORS.muted }}>
                <span>{r.l}</span><span style={{ fontWeight: 600 }}>{fmt(r.v)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7, color: COLORS.muted }}>
              <span>Discount (₹)</span>
              <input type="number" min="0" value={form.discount}
                onChange={e => set('discount', +e.target.value)}
                style={{ border: `1.5px solid ${COLORS.border}`, borderRadius: 6, padding: '4px 8px', width: 90, fontSize: 13, textAlign: 'right' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `2px solid ${COLORS.navy}`, paddingTop: 10, fontWeight: 800, fontSize: 17, color: COLORS.text }}>
              <span>Total</span>
              <span style={{ color: COLORS.accent }}>{fmt(total)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card style={{ marginBottom: 14 }}>
        <Input label="Notes / Payment Terms (optional)" value={form.notes}
          onChange={v => set('notes', v)} placeholder="e.g. Payment due within 15 days. Thank you!" />
      </Card>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn variant="subtle" onClick={() => handleSave('draft')}>💾 Save Draft</Btn>
        <Btn variant="primary" onClick={() => handleSave('unpaid')}>📤 Save &amp; Share</Btn>
        <Btn variant="success" onClick={() => handleSave('paid')}>✅ Mark as Paid</Btn>
      </div>
    </div>
  )
}
