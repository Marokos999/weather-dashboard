import { useState, useCallback } from 'react'

export default function SearchBar({ onSearch, onGeolocate, loading }) {
  const [value, setValue] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (value.trim() && !loading) onSearch(value.trim())
  }, [value, onSearch, loading])

  const handleGeolocate = () => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onGeolocate(pos.coords.latitude, pos.coords.longitude)
        setGeoLoading(false)
      },
      () => setGeoLoading(false)
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '560px', margin: '0 auto' }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search city (e.g. London, Tokyo...)"
        style={{
          flex: 1, padding: '13px 18px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#f1f5f9', fontSize: '14px', outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.6)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
      />
      <button
        type="button"
        onClick={handleGeolocate}
        disabled={geoLoading}
        title="Use my location"
        style={{
          padding: '13px 14px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: geoLoading ? '#475569' : '#93c5fd',
          fontSize: '18px', cursor: geoLoading ? 'not-allowed' : 'pointer',
          lineHeight: 1,
        }}
      >
        {geoLoading ? '…' : '⊙'}
      </button>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '13px 22px', borderRadius: '14px',
          background: loading ? '#1e3a5f' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          border: 'none', color: '#fff', fontWeight: '600', fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
        }}
      >
        {loading ? 'Loading...' : 'Search'}
      </button>
    </form>
  )
}
