import axios from 'axios'

export const getWeather = (city) =>
  axios.get(`/api/weather?city=${encodeURIComponent(city)}`).then(r => r.data)

export const getWeatherByCoords = (lat, lon) =>
  axios.get(`/api/weather?lat=${lat}&lon=${lon}`).then(r => r.data)

export const getForecast = (lat, lon) =>
  axios.get(`/api/forecast?lat=${lat}&lon=${lon}`).then(r => r.data)
