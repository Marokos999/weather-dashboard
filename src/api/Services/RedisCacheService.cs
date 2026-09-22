using System.Text.Json;
using StackExchange.Redis;

namespace WeatherApi.Services;

public class RedisCacheService : IRedisCacheService
{
    private readonly IDatabase? _db;

    public RedisCacheService(IConnectionMultiplexer? redis)
    {
        _db = redis?.GetDatabase();
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        if (_db == null) return default;
        try
        {
            var value = await _db.StringGetAsync(key);
            if (!value.HasValue) return default;
            return JsonSerializer.Deserialize<T>((string)value!);
        }
        catch { return default; }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan ttl)
    {
        if (_db == null) return;
        try
        {
            var json = JsonSerializer.Serialize(value);
            await _db.StringSetAsync(key, json, ttl);
        }
        catch { }
    }
}
