import { useState } from 'react'

function isFavorite(city) {
  try { return JSON.parse(localStorage.getItem('weather-favorites') || '[]').includes(city) }
  catch { return false }
}

function toggleFavorite(city) {
  const fav = isFavorite(city)
  window.dispatchEvent(new CustomEvent(fav ? 'remove-favorite' : 'add-favorite', { detail: city }))
}

const card = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px',
  padding: '28px',
}

export default function CurrentWeather({ data, unit, onUnitToggle }) {
  const [starred, setStarred] = useState(() => isFavorite(data.city))

  const toDisplay = (temp) =>
    unit === 'F' ? `${Math.round(temp * 9 / 5 + 32)}°F` : `${Math.round(temp)}°C`

  const handleStar = () => {
    toggleFavorite(data.city)
    setStarred(s => !s)
  }

  return (
    <div style={{
      ...card,
      background: 'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(29,78,216,0.1) 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blur circle */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '200px', height: '200px',
        background: 'rgba(96,165,250,0.08)',
        borderRadius: '50%', filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
            {data.city}, {data.country}
          </h2>
          <p style={{ color: '#93c5fd', fontSize: '14px', textTransform: 'capitalize' }}>
            {data.description}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleStar} style={{
            background: 'none', border: 'none', fontSize: '22px',
            cursor: 'pointer', lineHeight: 1, color: starred ? '#facc15' : '#475569',
            transition: 'transform 0.15s',
          }}>
            {starred ? '★' : '☆'}
          </button>
          <button onClick={onUnitToggle} style={{
            padding: '6px 14px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#cbd5e1', fontSize: '12px', fontWeight: '600',
            cursor: 'pointer',
          }}>
            {unit === 'C' ? '°F' : '°C'}
          </button>
        </div>
      </div>

      {/* Temp row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 0 16px rgba(96,165,250,0.4))' }}
        />
        <div>
          <div style={{ fontSize: '68px', fontWeight: '200', letterSpacing: '-2px', lineHeight: 1 }}>
            {toDisplay(data.temperature)}
          </div>
          <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
            Feels like {toDisplay(data.feelsLike)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[
          { label: 'Humidity', value: `${data.humidity}%` },
          { label: 'Wind Speed', value: `${data.windSpeed} m/s` },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px', padding: '16px',
          }}>
            <div style={{ color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              {label}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '600' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
