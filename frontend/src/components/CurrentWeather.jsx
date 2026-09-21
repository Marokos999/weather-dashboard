function isFavorite(city) {
  try {
    const favs = JSON.parse(localStorage.getItem('weather-favorites') || '[]')
    return favs.includes(city)
  } catch { return false }
}

function toggleFavorite(city) {
  const fav = isFavorite(city)
  window.dispatchEvent(new CustomEvent(fav ? 'remove-favorite' : 'add-favorite', { detail: city }))
}

export default function CurrentWeather({ data, unit, onUnitToggle }) {
  const [starred, setStarred] = useState(() => isFavorite(data.city))

  const handleStar = () => {
    toggleFavorite(data.city)
    setStarred(s => !s)
  }

  const toDisplay = (temp) => {
    if (unit === 'F') return `${Math.round(temp * 9 / 5 + 32)}°F`
    return `${Math.round(temp)}°C`
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{data.city}, {data.country}</h2>
          <p className="text-slate-400 capitalize">{data.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleStar}
            className="text-lg leading-none"
            title={starred ? 'Remove from favorites' : 'Add to favorites'}
          >
            {starred ? '★' : '☆'}
          </button>
          <button
            onClick={onUnitToggle}
            className="text-sm px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            {unit === 'C' ? '°F' : '°C'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          className="w-16 h-16"
        />
        <span className="text-6xl font-light">{toDisplay(data.temperature)}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="bg-slate-700 rounded-xl p-3">
          <p className="text-slate-400">Feels like</p>
          <p className="font-semibold">{toDisplay(data.feelsLike)}</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3">
          <p className="text-slate-400">Humidity</p>
          <p className="font-semibold">{data.humidity}%</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3">
          <p className="text-slate-400">Wind</p>
          <p className="font-semibold">{data.windSpeed} m/s</p>
        </div>
      </div>
    </div>
  )
}
