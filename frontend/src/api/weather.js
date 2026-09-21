import axios from 'axios'

export const getWeather = (city) =>
  axios.get(`/api/weather?city=${encodeURIComponent(city)}`).then(r => r.data)

export const getForecast = (lat, lon) =>
  axios.get(`/api/forecast?lat=${lat}&lon=${lon}`).then(r => r.data)

export const geocode = (q) =>
  axios.get(`/api/geocode?q=${encodeURIComponent(q)}`).then(r => r.data)
