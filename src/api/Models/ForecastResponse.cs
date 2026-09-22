using System.Text.Json.Serialization;

namespace WeatherApi.Models;

public class ForecastResponse
{
    [JsonPropertyName("hourly")] public List<HourlyItem> Hourly { get; set; } = [];
    [JsonPropertyName("daily")] public List<DailyItem> Daily { get; set; } = [];
}

public class HourlyItem
{
    [JsonPropertyName("time")] public DateTime Time { get; set; }
    [JsonPropertyName("temperature")] public double Temperature { get; set; }
    [JsonPropertyName("icon")] public string Icon { get; set; } = string.Empty;
    [JsonPropertyName("description")] public string Description { get; set; } = string.Empty;
}

public class DailyItem
{
    [JsonPropertyName("date")] public DateTime Date { get; set; }
    [JsonPropertyName("tempMin")] public double TempMin { get; set; }
    [JsonPropertyName("tempMax")] public double TempMax { get; set; }
    [JsonPropertyName("icon")] public string Icon { get; set; } = string.Empty;
    [JsonPropertyName("description")] public string Description { get; set; } = string.Empty;
    [JsonPropertyName("precipitationProbability")] public double PrecipitationProbability { get; set; }
}
