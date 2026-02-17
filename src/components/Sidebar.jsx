import { COLORS, NAV_ITEMS } from '../constants.js'

export default function Sidebar({ view, setView, bizName }) {
  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: COLORS.navy,
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      zIndex: 100,
      boxShadow: '2px 0 20px rgba(0,0,0,.18)',
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 18px 16px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: COLORS.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>📒</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>BillBook</div>
            <div style={{
              color: 'rgba(255,255,255,.4)', fontSize: 11, marginTop: 2,
              maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {bizName || 'My Business'}
            </div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '10px 10px' }}>
        {NAV_ITEMS.map((n) => {
          const active = view === n.id
          return (
            <div
              key={n.id}
              onClick={() => setView(n.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                marginBottom: 2,
                background: active ? 'rgba(59,111,240,.25)' : 'transparent',
                borderLeft: active ? `3px solid ${COLORS.accent}` : '3px solid transparent',
                transition: 'all .12s',
                userSelect: 'none',
              }}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              <span style={{ color: active ? '#fff' : 'rgba(255,255,255,.6)', fontSize: 13, fontWeight: active ? 700 : 500 }}>
                {n.label}
              </span>
            </div>
          )
        })}
      </nav>

      <div style={{ padding: '12px 18px', fontSize: 10, color: 'rgba(255,255,255,.18)', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        BillBook v1.0 • All data stored locally
      </div>
    </aside>
  )
}
