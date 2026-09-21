using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using WeatherApi.Models;
using System.Threading.Tasks;

namespace WeatherApi.Services;

public class WeatherService : IWeatherService
{
    private readonly HttpClient _http;
    private readonly IRedisCacheService _cache;
    private readonly string _apiKey;

    public WeatherService(IHttpClientFactory factory, IRedisCacheService cache, IConfiguration config)
    {
        _http = factory.CreateClient("openweather");
        _cache = cache;
        _apiKey = config["OWM_API_KEY"] ?? "YOUR_OWM_API_KEY";
    }

    public async Task<WeatherResponse> GetCurrentAsync(string city)
    {
        var key = $"weather:current:{city.ToLower()}";
        var cached = await _cache.GetAsync<WeatherResponse>(key);
        if (cached != null) return cached;

        var json = await _http.GetFromJsonAsync<JsonElement>(
            $"weather?q={city}&appid={_apiKey}&units=metric");

        var result = new WeatherResponse
        {
            City = json.GetProperty("name").GetString()!,
            Country = json.GetProperty("sys").GetProperty("country").GetString()!,
            Temperature = json.GetProperty("main").GetProperty("temp").GetDouble(),
            FeelsLike = json.GetProperty("main").GetProperty("feels_like").GetDouble(),
            Humidity = json.GetProperty("main").GetProperty("humidity").GetInt32(),
            WindSpeed = json.GetProperty("wind").GetProperty("speed").GetDouble(),
            Description = json.GetProperty("weather")[0].GetProperty("description").GetString()!,
            Icon = json.GetProperty("weather")[0].GetProperty("icon").GetString()!,
            Lat = json.GetProperty("coord").GetProperty("lat").GetDouble(),
            Lon = json.GetProperty("coord").GetProperty("lon").GetDouble()
        };

        await _cache.SetAsync(key, result, TimeSpan.FromMinutes(10));
        return result;
    }

    public async Task<ForecastResponse> GetForecastAsync(double lat, double lon)
    {
        var key = $"weather:forecast:{lat}:{lon}";
        var cached = await _cache.GetAsync<ForecastResponse>(key);
        if (cached != null) return cached;

        var json = await _http.GetFromJsonAsync<JsonElement>(
            $"onecall?lat={lat}&lon={lon}&exclude=current,minutely,alerts&appid={_apiKey}&units=metric");

        var result = new ForecastResponse
        {
            Hourly = json.GetProperty("hourly").EnumerateArray().Take(24).Select(h => new HourlyItem
            {
                Time = DateTimeOffset.FromUnixTimeSeconds(h.GetProperty("dt").GetInt64()).UtcDateTime,
                Temperature = h.GetProperty("temp").GetDouble(),
                Icon = h.GetProperty("weather")[0].GetProperty("icon").GetString()!,
                Description = h.GetProperty("weather")[0].GetProperty("description").GetString()!
            }).ToList(),
            Daily = json.GetProperty("daily").EnumerateArray().Take(7).Select(d => new DailyItem
            {
                Date = DateTimeOffset.FromUnixTimeSeconds(d.GetProperty("dt").GetInt64()).UtcDateTime,
                TempMin = d.GetProperty("temp").GetProperty("min").GetDouble(),
                TempMax = d.GetProperty("temp").GetProperty("max").GetDouble(),
                Icon = d.GetProperty("weather")[0].GetProperty("icon").GetString()!,
                Description = d.GetProperty("weather")[0].GetProperty("description").GetString()!,
                PrecipitationProbability = d.GetProperty("pop").GetDouble() * 100
            }).ToList()
        };

        await _cache.SetAsync(key, result, TimeSpan.FromMinutes(10));
        return result;
    }

    public async Task<(double Lat, double Lon)> GeocodeAsync(string query)
    {
        var json = await _http.GetFromJsonAsync<JsonElement[]>(
            $"https://api.openweathermap.org/geo/1.0/direct?q={query}&limit=1&appid={_apiKey}");

        if (json == null || json.Length == 0)
            throw new Exception($"City not found: {query}");

        return (json[0].GetProperty("lat").GetDouble(), json[0].GetProperty("lon").GetDouble());
    }
}