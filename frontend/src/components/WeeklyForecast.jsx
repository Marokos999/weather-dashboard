const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function WeeklyForecast({ data, unit }) {
  const toDisplay = (temp) =>
    unit === 'F' ? `${Math.round(temp * 9 / 5 + 32)}°` : `${Math.round(temp)}°`

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">7-Day Forecast</h3>
      <div className="grid grid-cols-7 gap-2">
        {data.map((d, i) => {
          const day = DAYS[new Date(d.date).getDay()]
          return (
            <div key={i} className="flex flex-col items-center gap-1 bg-slate-700 rounded-xl p-2 text-sm">
              <span className="text-slate-400 text-xs">{i === 0 ? 'Today' : day}</span>
              <img
                src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                alt={d.description}
                className="w-8 h-8"
              />
              <span className="font-semibold">{toDisplay(d.tempMax)}</span>
              <span className="text-slate-400">{toDisplay(d.tempMin)}</span>
              {d.precipitationProbability > 0 && (
                <span className="text-blue-400 text-xs">{Math.round(d.precipitationProbability)}%</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
