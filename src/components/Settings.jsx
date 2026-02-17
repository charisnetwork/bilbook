import { useState } from 'react'
import { COLORS } from '../constants.js'
import { clearData } from '../utils/storage.js'
import { Card, Btn, Input, Textarea } from './UI.jsx'

export default function Settings({ data, onDataChange }) {
  const [form,  setForm]  = useState(data.settings || {})
  const [saved, setSaved] = useState(false)

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const save = () => {
    onDataChange({ ...data, settings: form })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const exportData = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `billbook-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        if (!parsed.invoices || !parsed.customers) return alert('Invalid backup file')
        onDataChange(parsed)
        alert('✅ Data imported successfully!')
      } catch {
        alert('❌ Failed to parse backup file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const stats = {
    invoices:  (data.invoices  || []).length,
    customers: (data.customers || []).length,
    products:  (data.products  || []).length,
    expenses:  (data.expenses  || []).length,
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 22px' }}>Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <div>
          {/* Business profile */}
          <Card style={{ marginBottom: 16 }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>🏢 Business Profile</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input label="Business Name *" value={form.businessName || ''} onChange={v => setF('businessName', v)} placeholder="Your Business Name" />
              <Input label="GST Number"      value={form.gst || ''}          onChange={v => setF('gst', v)}          placeholder="22AAAAA0000A1Z5" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input label="Phone"  value={form.phone || ''}  onChange={v => setF('phone', v)}  placeholder="+91 98765 43210" />
                <Input label="Email"  value={form.email || ''}  onChange={v => setF('email', v)}  placeholder="business@email.com" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Address</label>
                <textarea
                  value={form.address || ''}
                  onChange={e => setF('address', e.target.value)}
                  rows={3}
                  placeholder="Full business address"
                  style={{ border: `1.5px solid ${COLORS.border}`, borderRadius: 8, padding: '9px 12px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
              <Input label="Invoice Prefix" value={form.invoicePrefix || 'INV'} onChange={v => setF('invoicePrefix', v)} placeholder="INV" />
            </div>
            <div style={{ marginTop: 16 }}>
              <Btn onClick={save} variant={saved ? 'success' : 'primary'}>
                {saved ? '✅ Saved!' : '💾 Save Settings'}
              </Btn>
            </div>
          </Card>
        </div>

        <div>
          {/* Data stats */}
          <Card style={{ marginBottom: 16 }}>
            <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>📊 Data Overview</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { l: 'Invoices',  v: stats.invoices,  icon: '🧾' },
                { l: 'Customers', v: stats.customers, icon: '👥' },
                { l: 'Products',  v: stats.products,  icon: '🏷️' },
                { l: 'Expenses',  v: stats.expenses,  icon: '💸' },
              ].map(s => (
                <div key={s.l} style={{ background: COLORS.bg, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.accent }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600 }}>{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Backup & Restore */}
          <Card>
            <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>💾 Backup & Restore</h4>
            <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14, lineHeight: 1.5 }}>
              Export your data as a JSON file to keep a backup, or import a previous backup to restore your data.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn variant="dark" onClick={exportData}>📥 Export / Download Backup</Btn>
              <label style={{
                padding: '9px 18px',
                borderRadius: 8,
                border: `1.5px solid ${COLORS.accent}`,
                color: COLORS.accent,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all .15s',
              }}>
                📤 Import Backup
                <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
              </label>
            </div>

            <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.red, marginBottom: 8, textTransform: 'uppercase' }}>Danger Zone</div>
              <Btn variant="danger" onClick={clearData}>🗑️ Clear All Data</Btn>
              <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 6 }}>This action is irreversible!</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
