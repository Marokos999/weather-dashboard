# Weather Dashboard



**Live demo:** https://happy-mud-0d2ce4f10.azurestaticapps.net

---

## Features

- **Real-time weather** — current conditions, feels-like, humidity, wind speed & direction
- **Hourly forecast** — next 24h in 3-hour intervals
- **7-day forecast** — daily high/low, precipitation probability
- **Interactive map** — Rain / Wind / Temperature / Clouds layer toggle (OWM tile proxy)
- **City favorites** — star cities, persisted in localStorage via Alpine.js widget
- **Geolocation** — "Use my location" button
- **°C / °F toggle** — preference saved across sessions
- **Redis caching** — 10-min TTL per city, falls back gracefully if cache unavailable

---

## Architecture

```
React (Vite + Tailwind)
    │
    ▼ /api/*
Azure Static Web Apps
    │
    ▼ HTTP trigger
Azure Functions (.NET 9 isolated worker)
    │              │
    ▼              ▼
OpenWeatherMap   Redis Cache (10-min TTL)
```

- OWM API key never leaves the server — map tiles are proxied through a backend Function
- Alpine.js favorites widget lives outside the React root, communicates via `CustomEvent` bridge

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Widgets | Alpine.js 3 |
| Map | Leaflet.js + react-leaflet |
| Backend | Azure Functions v4, .NET 9 isolated worker |
| Cache | Redis (StackExchange.Redis, optional) |
| Weather API | OpenWeatherMap free tier |
| Deployment | Azure Static Web Apps |
| CI/CD | GitHub Actions |

---

## Local Development

### Docker (recommended)

```bash
# Copy and fill in your API key
cp .env.example .env
# Edit .env: OWM_API_KEY=your_key_here

docker compose up --build
```

App available at `http://localhost:3000`.

### Manual

#### Prerequisites
- .NET 9 SDK, Node.js 20+, Azure Functions Core Tools v4

```bash
# Backend (src/api/local.settings.json must have OWM_API_KEY)
cd src/api && func start

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

Frontend proxies `/api/*` to `http://localhost:7071` via Vite config.

---

## Deployment

1. Create **Azure Static Web App** (Free tier) linked to this repo
2. Add GitHub secrets: `AZURE_STATIC_WEB_APPS_API_TOKEN_*`, `OWM_API_KEY`
3. Add `OWM_API_KEY` to SWA → Environment Variables (Production)
4. Push to `main` — GitHub Actions handles build and deploy

---

## Project Structure

```
weather-dashboard/
├── src/api/                    # Azure Functions (.NET 9)
│   ├── Functions/
│   │   ├── WeatherFunction.cs      # GET /api/weather
│   │   ├── WeatherFullFunction.cs  # GET /api/weather-full (combined)
│   │   ├── ForecastFunction.cs     # GET /api/forecast
│   │   ├── GeocodeFunction.cs      # GET /api/geocode
│   │   └── MapTileFunction.cs      # GET /api/map/{layer}/{z}/{x}/{y}
│   ├── Services/
│   │   ├── WeatherService.cs
│   │   └── RedisCacheService.cs
│   └── Models/
│       ├── WeatherResponse.cs
│       └── ForecastResponse.cs
├── frontend/                   # React + Vite
│   └── src/
│       ├── components/
│       │   ├── CurrentWeather.jsx
│       │   ├── HourlyForecast.jsx
│       │   ├── WeeklyForecast.jsx
│       │   ├── WeatherMap.jsx
│       │   ├── SearchBar.jsx
│       │   └── SkeletonCard.jsx
│       └── utils/temperature.js
└── .github/workflows/azure-swa.yml
```
