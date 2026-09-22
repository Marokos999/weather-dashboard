import { useState, useCallback, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import HourlyForecast from './components/HourlyForecast'
import WeeklyForecast from './components/WeeklyForecast'
import WeatherMap from './components/WeatherMap'
import { getWeather, getForecast } from './api/weather'

export default function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState('C')

  const handleSearch = useCallback(async (city) => {
    setLoading(true)
    setError(null)
    try {
      const w = await getWeather(city)
      const f = await getForecast(w.lat, w.lon)
      setWeather(w)
      setForecast(f)
    } catch (err) {
      setError(err.response?.data ?? 'City not found or service unavailable.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const handler = (e) => handleSearch(e.detail)
    window.addEventListener('weather-search', handler)
    return () => window.removeEventListener('weather-search', handler)
  }, [handleSearch])

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>⛅</div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '6px' }}>
            Weather Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            OpenWeatherMap · Redis Cache · Azure Functions
          </p>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Error */}
        {error && (
          <div style={{
            marginTop: '16px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#fca5a5',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', color: '#475569', marginTop: '48px', fontSize: '14px' }}>
            Loading...
          </div>
        )}

        {/* Content */}
        {weather && !loading && (
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <CurrentWeather
              data={weather}
              unit={unit}
              onUnitToggle={() => setUnit(u => u === 'C' ? 'F' : 'C')}
            />
            {forecast && (
              <>
                <HourlyForecast data={forecast.hourly} unit={unit} />
                <WeeklyForecast data={forecast.daily} unit={unit} />
              </>
            )}
            <WeatherMap lat={weather.lat} lon={weather.lon} />
          </div>
        )}

        {/* Empty state */}
        {!weather && !loading && !error && (
          <div style={{ textAlign: 'center', color: '#334155', marginTop: '80px' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>🌍</div>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
              Search for any city
            </p>
            <p style={{ fontSize: '13px', color: '#334155' }}>
              Current conditions · Hourly · 7-day forecast · Map
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
