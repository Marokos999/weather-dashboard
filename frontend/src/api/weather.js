import axios from 'axios'

export const getWeatherFull = (city) =>
  axios.get(`/api/weather-full?city=${encodeURIComponent(city)}`).then(r => r.data)

export const getWeatherFullByCoords = (lat, lon) =>
  axios.get(`/api/weather-full?lat=${lat}&lon=${lon}`).then(r => r.data)
