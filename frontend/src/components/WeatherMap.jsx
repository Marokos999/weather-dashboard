import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'

function MapUpdater({ lat, lon }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lon], 6, { duration: 1.2 })
  }, [lat, lon, map])
  return null
}

const LAYERS = [
  { id: 'precipitation_new', label: 'Rain' },
  { id: 'wind_new', label: 'Wind' },
  { id: 'temp_new', label: 'Temp' },
  { id: 'clouds_new', label: 'Clouds' },
]

const btnBase = {
  padding: '5px 14px', borderRadius: '8px', border: 'none',
  fontSize: '12px', fontWeight: '600', cursor: 'pointer',
  transition: 'all 0.15s',
}

export default function WeatherMap({ lat, lon }) {
  const [activeLayer, setActiveLayer] = useState('precipitation_new')

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '24px',
    }}>
      {/* Header + layer toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Weather Map
        </h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          {LAYERS.map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              style={{
                ...btnBase,
                background: activeLayer === l.id ? 'rgba(37,99,235,0.7)' : 'rgba(255,255,255,0.06)',
                color: activeLayer === l.id ? '#fff' : '#64748b',
                border: activeLayer === l.id ? '1px solid rgba(96,165,250,0.4)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '260px', borderRadius: '14px', overflow: 'hidden' }}>
        <MapContainer center={[lat, lon]} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />
          <TileLayer
            key={activeLayer}
            url={`/api/map/${activeLayer}/{z}/{x}/{y}`}
            opacity={0.6}
          />
          <MapUpdater lat={lat} lon={lon} />
        </MapContainer>
      </div>
    </div>
  )
}
