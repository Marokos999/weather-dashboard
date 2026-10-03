using System.Text.Json.Serialization;

namespace WeatherApi.Models;

public class WeatherFullResponse
{
    [JsonPropertyName("weather")] public WeatherResponse Weather { get; set; } = new();
    [JsonPropertyName("forecast")] public ForecastResponse Forecast { get; set; } = new();
}
