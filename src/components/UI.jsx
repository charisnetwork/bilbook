import { COLORS } from '../constants.js'

/* ── Card ── */
export const Card = ({ children, style = {} }) => (
  <div style={{
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    padding: 20,
    ...style,
  }}>
    {children}
  </div>
)

/* ── Button ── */
export const Btn = ({ children, onClick, variant = 'primary', size = 'md', style = {}, disabled, type = 'button' }) => {
  const sizes = {
    sm: { padding: '5px 11px', fontSize: 12 },
    md: { padding: '9px 18px', fontSize: 14 },
    lg: { padding: '12px 26px', fontSize: 15 },
  }
  const variants = {
    primary: { background: COLORS.accent, color: '#fff', border: 'none' },
    success: { background: COLORS.green, color: '#fff', border: 'none' },
    danger:  { background: COLORS.red, color: '#fff', border: 'none' },
    ghost:   { background: 'transparent', color: COLORS.accent, border: `1.5px solid ${COLORS.accent}` },
    subtle:  { background: COLORS.accentLight, color: COLORS.accent, border: 'none' },
    dark:    { background: COLORS.navy, color: '#fff', border: 'none' },
    warning: { background: COLORS.amber, color: '#fff', border: 'none' },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 8,
        fontWeight: 600,
        transition: 'all .15s',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/* ── Input ── */
export const Input = ({ label, value, onChange, type = 'text', placeholder, required, style = {}, disabled }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    {label && (
      <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}{required && <span style={{ color: COLORS.red }}> *</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: '9px 12px',
        fontSize: 14,
        color: COLORS.text,
        background: disabled ? '#F1F5F9' : '#FAFAFA',
        ...style,
      }}
    />
  </div>
)

/* ── Select ── */
export const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    {label && (
      <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </label>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: '9px 12px',
        fontSize: 14,
        color: COLORS.text,
        background: '#FAFAFA',
        ...style,
      }}
    >
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  </div>
)

/* ── Textarea ── */
export const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    {label && (
      <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </label>
    )}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: '9px 12px',
        fontSize: 14,
        color: COLORS.text,
        background: '#FAFAFA',
        resize: 'vertical',
        fontFamily: 'inherit',
      }}
    />
  </div>
)

/* ── Badge ── */
export const Badge = ({ label, color = COLORS.accent, bg = COLORS.accentLight }) => (
  <span style={{ background: bg, color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
    {label}
  </span>
)

/* ── Status Badge ── */
export const StatusBadge = ({ status }) => {
  const map = {
    paid:    { label: 'Paid',    color: COLORS.green, bg: COLORS.greenLight },
    unpaid:  { label: 'Unpaid',  color: COLORS.red,   bg: COLORS.redLight },
    partial: { label: 'Partial', color: COLORS.amber,  bg: COLORS.amberLight },
    draft:   { label: 'Draft',   color: COLORS.muted,  bg: COLORS.border },
  }
  const s = map[status] || map.draft
  return <Badge label={s.label} color={s.color} bg={s.bg} />
}

/* ── Empty State ── */
export const Empty = ({ icon, title, subtitle }) => (
  <div style={{ textAlign: 'center', padding: '48px 20px', color: COLORS.muted }}>
    <div style={{ fontSize: 44, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{title}</div>
    {subtitle && <div style={{ fontSize: 13 }}>{subtitle}</div>}
  </div>
)

/* ── Section Header ── */
export const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ color: COLORS.muted, fontSize: 13, margin: '3px 0 0' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
)

/* ── Stat Card ── */
export const StatCard = ({ label, value, icon, color, bg }) => (
  <Card style={{ padding: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </span>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
  </Card>
)

/* ── Inline Table ── */
export const TableHead = ({ cols }) => (
  <thead>
    <tr style={{ borderBottom: `1.5px solid ${COLORS.border}` }}>
      {cols.map((c) => (
        <th key={c} style={{ textAlign: 'left', padding: '7px 8px', color: COLORS.muted, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {c}
        </th>
      ))}
    </tr>
  </thead>
)
