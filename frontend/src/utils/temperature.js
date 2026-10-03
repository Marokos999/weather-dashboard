export const toDisplay = (temp, unit) =>
  unit === 'F' ? `${Math.round(temp * 9 / 5 + 32)}°F` : `${Math.round(temp)}°C`

export const toDisplayShort = (temp, unit) =>
  unit === 'F' ? `${Math.round(temp * 9 / 5 + 32)}°` : `${Math.round(temp)}°`
