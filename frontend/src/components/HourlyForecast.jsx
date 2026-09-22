export default function HourlyForecast({ data, unit }) {
  const toDisplay = (temp) =>
    unit === 'F' ? `${Math.round(temp * 9 / 5 + 32)}°` : `${Math.round(temp)}°`

  const formatHour = (iso) => {
    const d = new Date(iso)
    return d.getHours().toString().padStart(2, '0') + ':00'
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '24px',
    }}>
      <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
        Hourly Forecast
      </h3>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {data.map((h, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            minWidth: '64px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '12px 8px',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>{i === 0 ? 'Now' : formatHour(h.time)}</span>
            <img
              src={`https://openweathermap.org/img/wn/${h.icon}.png`}
              alt={h.description}
              style={{ width: '36px', height: '36px' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{toDisplay(h.temperature)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
