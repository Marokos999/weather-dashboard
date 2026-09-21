export default function HourlyForecast({ data, unit }) {
  const toDisplay = (temp) =>
    unit === 'F' ? `${Math.round(temp * 9 / 5 + 32)}°` : `${Math.round(temp)}°`

  const formatHour = (iso) => {
    const d = new Date(iso)
    return d.getHours().toString().padStart(2, '0') + ':00'
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Hourly</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {data.map((h, i) => (
          <div key={i} className="flex flex-col items-center gap-1 min-w-[56px] bg-slate-700 rounded-xl p-2">
            <span className="text-xs text-slate-400">{formatHour(h.time)}</span>
            <img
              src={`https://openweathermap.org/img/wn/${h.icon}.png`}
              alt={h.description}
              className="w-8 h-8"
            />
            <span className="text-sm font-semibold">{toDisplay(h.temperature)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
