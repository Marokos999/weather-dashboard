import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const OWM_KEY = import.meta.env.VITE_OWM_API_KEY ?? ''

export default function WeatherMap({ lat, lon }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Precipitation Map</h3>
      <div className="h-64 rounded-xl overflow-hidden">
        <MapContainer center={[lat, lon]} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />
          <TileLayer
            url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`}
            opacity={0.6}
          />
        </MapContainer>
      </div>
    </div>
  )
}
