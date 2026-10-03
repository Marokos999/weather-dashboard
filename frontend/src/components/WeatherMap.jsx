import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

function MapUpdater({ lat, lon }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lon], 6, { duration: 1.2 })
  }, [lat, lon, map])
  return null
}

export default function WeatherMap({ lat, lon }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '24px',
    }}>
      <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
        Precipitation Map
      </h3>
      <div style={{ height: '260px', borderRadius: '14px', overflow: 'hidden' }}>
        <MapContainer center={[lat, lon]} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />
          <TileLayer
            url="/api/map/precipitation_new/{z}/{x}/{y}"
            opacity={0.6}
          />
          <MapUpdater lat={lat} lon={lon} />
        </MapContainer>
      </div>
    </div>
  )
}
