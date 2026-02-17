import { useState } from 'react'
import { COLORS, TAX_RATES, UNITS } from '../constants.js'
import { fmt, uid } from '../utils/helpers.js'
import { Card, Btn, Input, Select, Badge, PageHeader, Empty, TableHead } from './UI.jsx'

const blankForm = () => ({ id: '', name: '', sku: '', category: '', unit: 'pcs', price: '', purchasePrice: '', tax: 0, stock: 0, minStock: 5 })

export default function Products({ data, onDataChange }) {
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState(blankForm())
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState('name')

  const products = data.products || []

  const filtered = products
    .filter(p => !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return (b.price || 0) - (a.price || 0)
      if (sortBy === 'stock') return (b.stock || 0) - (a.stock || 0)
      return (a.name || '').localeCompare(b.name || '')
    })

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const openAdd  = () => { setForm(blankForm()); setShowForm(true) }
  const openEdit = (p) => { setForm(p); setShowForm(true) }

  const save = () => {
    if (!form.name.trim()) return alert('Product name is required')
    const list = form.id
      ? products.map(p => p.id === form.id ? { ...form, price: +form.price, purchasePrice: +form.purchasePrice, stock: +form.stock } : p)
      : [...products, { ...form, id: uid(), price: +form.price, purchasePrice: +form.purchasePrice, stock: +form.stock }]
    onDataChange({ ...data, products: list })
    setShowForm(false)
    setForm(blankForm())
  }

  const del = (id) => {
    if (!confirm('Delete this product?')) return
    onDataChange({ ...data, products: products.filter(p => p.id !== id) })
  }

  const adjustStock = (id, delta) => {
    onDataChange({
      ...data,
      products: products.map(p => p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p),
    })
  }

  const lowStock = products.filter(p => (p.stock || 0) <= (p.minStock || 5))

  return (
    <div>
      <PageHeader
        title="Products & Services"
        subtitle={`${products.length} items`}
        action={<Btn onClick={openAdd}>+ Add Product</Btn>}
      />

      {lowStock.length > 0 && (
        <div style={{ background: COLORS.amberLight, border: `1.5px solid ${COLORS.amber}`, borderRadius: 10, padding: '10px 16px', marginBottom: 14, fontSize: 13, color: '#92400E' }}>
          ⚠️ <strong>{lowStock.length} item{lowStock.length > 1 ? 's' : ''}</strong> with low stock: {lowStock.map(p => p.name).join(', ')}
        </div>
      )}

      {showForm && (
        <Card style={{ marginBottom: 16, border: `2px solid ${COLORS.accent}` }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>
            {form.id ? 'Edit' : 'Add'} Product / Service
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
            <Input label="Name *"       value={form.name}          onChange={v => setF('name', v)} required />
            <Input label="SKU / Code"   value={form.sku}           onChange={v => setF('sku', v)} />
            <Input label="Category"     value={form.category}      onChange={v => setF('category', v)} />
            <Select label="Unit"        value={form.unit}          onChange={v => setF('unit', v)} options={UNITS.map(u => ({ value: u, label: u }))} />
            <Input label="Selling Price (₹) *" type="number" value={form.price}         onChange={v => setF('price', v)} />
            <Input label="Purchase Price (₹)"  type="number" value={form.purchasePrice} onChange={v => setF('purchasePrice', v)} />
            <Select label="GST Tax %"   value={form.tax}           onChange={v => setF('tax', +v)} options={TAX_RATES.map(r => ({ value: r, label: `${r}%` }))} />
            <Input label="Current Stock" type="number" value={form.stock}     onChange={v => setF('stock', v)} />
            <Input label="Min Stock Alert" type="number" value={form.minStock} onChange={v => setF('minStock', v)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={save}>{form.id ? 'Update' : 'Save Product'}</Btn>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setForm(blankForm()) }}>Cancel</Btn>
          </div>
        </Card>
      )}

      <Card>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, SKU or category..."
            style={{ flex: 1, border: `1.5px solid ${COLORS.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 13 }} />
          <Select value={sortBy} onChange={setSortBy} options={[
            { value: 'name', label: 'Sort: Name' },
            { value: 'price', label: 'Sort: Price' },
            { value: 'stock', label: 'Sort: Stock' },
          ]} />
        </div>

        {filtered.length === 0 ? (
          <Empty icon="🏷️" title="No products yet" subtitle="Add products or services to quickly add them to invoices" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <TableHead cols={['Name', 'SKU', 'Category', 'Unit', 'Sell Price', 'Buy Price', 'Tax', 'Stock', 'Actions']} />
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '10px 8px', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '10px 8px', color: COLORS.muted }}>{p.sku || '—'}</td>
                    <td style={{ padding: '10px 8px', color: COLORS.muted }}>{p.category || '—'}</td>
                    <td style={{ padding: '10px 8px' }}>{p.unit}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 700, color: COLORS.accent }}>{fmt(p.price)}</td>
                    <td style={{ padding: '10px 8px', color: COLORS.muted }}>{p.purchasePrice ? fmt(p.purchasePrice) : '—'}</td>
                    <td style={{ padding: '10px 8px' }}><Badge label={`${p.tax}%`} /></td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => adjustStock(p.id, -1)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${COLORS.border}`, cursor: 'pointer', background: '#fff', fontSize: 14, lineHeight: 1 }}>−</button>
                        <span style={{ fontWeight: 700, color: (p.stock || 0) <= (p.minStock || 5) ? COLORS.red : COLORS.green, minWidth: 24, textAlign: 'center' }}>{p.stock || 0}</span>
                        <button onClick={() => adjustStock(p.id, +1)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${COLORS.border}`, cursor: 'pointer', background: '#fff', fontSize: 14, lineHeight: 1 }}>+</button>
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Btn size="sm" variant="ghost"  onClick={() => openEdit(p)}>Edit</Btn>
                        <Btn size="sm" variant="danger" onClick={() => del(p.id)}>Del</Btn>
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
