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

        // Free tier: 5-day forecast with 3h intervals
        var json = await _http.GetFromJsonAsync<JsonElement>(
            $"forecast?lat={lat}&lon={lon}&appid={_apiKey}&units=metric");

        var items = json.GetProperty("list").EnumerateArray().ToList();

        var hourly = items.Take(8).Select(h => new HourlyItem
        {
            Time = DateTimeOffset.FromUnixTimeSeconds(h.GetProperty("dt").GetInt64()).UtcDateTime,
            Temperature = h.GetProperty("main").GetProperty("temp").GetDouble(),
            Icon = h.GetProperty("weather")[0].GetProperty("icon").GetString()!,
            Description = h.GetProperty("weather")[0].GetProperty("description").GetString()!
        }).ToList();

        var daily = items
            .GroupBy(h => DateTimeOffset.FromUnixTimeSeconds(h.GetProperty("dt").GetInt64()).UtcDateTime.Date)
            .Take(7)
            .Select(g => new DailyItem
            {
                Date = g.Key,
                TempMin = g.Min(h => h.GetProperty("main").GetProperty("temp_min").GetDouble()),
                TempMax = g.Max(h => h.GetProperty("main").GetProperty("temp_max").GetDouble()),
                Icon = g.First().GetProperty("weather")[0].GetProperty("icon").GetString()!,
                Description = g.First().GetProperty("weather")[0].GetProperty("description").GetString()!,
                PrecipitationProbability = g.Max(h => h.TryGetProperty("pop", out var pop) ? pop.GetDouble() * 100 : 0)
            }).ToList();

        var result = new ForecastResponse { Hourly = hourly, Daily = daily };
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