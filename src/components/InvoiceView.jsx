import { COLORS } from '../constants.js'
import { fmt, fmtDate } from '../utils/helpers.js'
import { Btn } from './UI.jsx'

export default function InvoiceView({ inv, onBack, settings }) {
  const s = settings || {}

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <Btn variant="ghost" size="sm" onClick={onBack}>← Back</Btn>
        <Btn variant="primary" size="sm" onClick={() => window.print()}>🖨️ Print / Download PDF</Btn>
      </div>

      <div id="invoice-print" style={{ maxWidth: 720, margin: '0 auto', background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,.08)' }}>

        {/* Header band */}
        <div style={{ background: COLORS.navy, color: '#fff', padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>{s.businessName || 'My Business'}</div>
            {s.gst    && <div style={{ fontSize: 12, opacity: 0.65 }}>GST: {s.gst}</div>}
            {s.phone  && <div style={{ fontSize: 12, opacity: 0.65 }}>📞 {s.phone}</div>}
            {s.email  && <div style={{ fontSize: 12, opacity: 0.65 }}>✉️ {s.email}</div>}
            {s.address && <div style={{ fontSize: 12, opacity: 0.65, maxWidth: 220, marginTop: 2 }}>{s.address}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.accent, letterSpacing: -1 }}>
              {inv.type === 'purchase' ? 'PURCHASE' : 'INVOICE'}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>#{inv.number}</div>
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>Date: {fmtDate(inv.date)}</div>
            <div style={{ fontSize: 12, opacity: 0.65 }}>Due: {fmtDate(inv.dueDate)}</div>
          </div>
        </div>

        {/* Bill to strip */}
        <div style={{ padding: '18px 36px', background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }}>
            {inv.type === 'purchase' ? 'Supplier' : 'Bill To'}
          </div>
          <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.text }}>{inv.customer}</div>
          {inv.customerPhone && <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>📞 {inv.customerPhone}</div>}
          {inv.customerGST   && <div style={{ fontSize: 13, color: COLORS.muted }}>GST: {inv.customerGST}</div>}
          {inv.billingAddr   && <div style={{ fontSize: 13, color: COLORS.muted }}>{inv.billingAddr}</div>}
        </div>

        {/* Items */}
        <div style={{ padding: '24px 36px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                {['#', 'Description', 'Qty', 'Unit', 'Rate', 'Tax', 'Amount'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: COLORS.muted, fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(inv.items || []).map((it, i) => {
                const amt    = (it.qty || 0) * (it.price || 0)
                const taxAmt = amt * ((it.tax || 0) / 100)
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '10px' }}>{i + 1}</td>
                    <td style={{ padding: '10px', fontWeight: 500 }}>{it.desc}</td>
                    <td style={{ padding: '10px' }}>{it.qty}</td>
                    <td style={{ padding: '10px', color: COLORS.muted }}>{it.unit || '—'}</td>
                    <td style={{ padding: '10px' }}>{fmt(it.price)}</td>
                    <td style={{ padding: '10px' }}>{it.tax}%</td>
                    <td style={{ padding: '10px', fontWeight: 700 }}>{fmt(amt + taxAmt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
            <div style={{ width: 280, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: COLORS.muted }}>
                <span>Sub Total</span><span>{fmt(inv.subTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: COLORS.muted }}>
                <span>Tax</span><span>{fmt(inv.taxTotal)}</span>
              </div>
              {(inv.discount > 0) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: COLORS.red }}>
                  <span>Discount</span><span>-{fmt(inv.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `2px solid ${COLORS.navy}`, paddingTop: 10, fontWeight: 800, fontSize: 18, color: COLORS.text, marginTop: 5 }}>
                <span>Total</span>
                <span style={{ color: COLORS.accent }}>{fmt(inv.total)}</span>
              </div>
              {inv.paid > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: COLORS.green, fontWeight: 600 }}>
                    <span>Paid</span><span>{fmt(inv.paid)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: COLORS.red, fontWeight: 700 }}>
                    <span>Balance Due</span><span>{fmt((inv.total || 0) - (inv.paid || 0))}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          {inv.notes && (
            <div style={{ marginTop: 20, padding: 14, background: COLORS.bg, borderRadius: 8, fontSize: 13, color: COLORS.muted, borderLeft: `4px solid ${COLORS.accent}` }}>
              <strong style={{ color: COLORS.text }}>Notes: </strong>{inv.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 36px', background: COLORS.navy, color: 'rgba(255,255,255,.4)', fontSize: 11, textAlign: 'center' }}>
          Thank you for your business! • Generated by BillBook
        </div>
      </div>
    </div>
  )
}
