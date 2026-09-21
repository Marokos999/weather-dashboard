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
      setError(err.response?.data ?? 'Failed to fetch weather data.')
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
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Weather Dashboard</h1>
          <p className="text-slate-400 text-sm mb-6">Powered by OpenWeatherMap · Cached with Redis</p>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {weather && (
          <>
            <CurrentWeather data={weather} unit={unit} onUnitToggle={() => setUnit(u => u === 'C' ? 'F' : 'C')} />
            {forecast && (
              <>
                <HourlyForecast data={forecast.hourly} unit={unit} />
                <WeeklyForecast data={forecast.daily} unit={unit} />
              </>
            )}
            <WeatherMap lat={weather.lat} lon={weather.lon} />
          </>
        )}

        {!weather && !loading && (
          <div className="text-center text-slate-500 mt-12">
            <p className="text-5xl mb-4">⛅</p>
            <p>Search for a city to see the weather</p>
          </div>
        )}
      </div>
    </div>
  )
}
