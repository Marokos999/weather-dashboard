const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function WeeklyForecast({ data, unit }) {
  const toDisplay = (temp) =>
    unit === 'F' ? `${Math.round(temp * 9 / 5 + 32)}°` : `${Math.round(temp)}°`

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '24px',
    }}>
      <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
        7-Day Forecast
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {data.map((d, i) => {
          const day = DAYS[new Date(d.date).getDay()]
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px',
              borderRadius: '14px',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ width: '40px', fontSize: '13px', color: '#94a3b8', flexShrink: 0 }}>
                {i === 0 ? 'Today' : day}
              </span>
              <img
                src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                alt={d.description}
                style={{ width: '32px', height: '32px', flexShrink: 0 }}
              />
              <span style={{ flex: 1, fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>
                {d.description}
              </span>
              {d.precipitationProbability > 0 && (
                <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: '500', flexShrink: 0 }}>
                  {Math.round(d.precipitationProbability)}%
                </span>
              )}
              <div style={{ display: 'flex', gap: '8px', fontSize: '14px', fontWeight: '600', flexShrink: 0 }}>
                <span style={{ color: '#475569' }}>{toDisplay(d.tempMin)}</span>
                <span style={{ color: '#f1f5f9' }}>{toDisplay(d.tempMax)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
