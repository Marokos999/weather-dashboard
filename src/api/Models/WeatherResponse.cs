using System.Text.Json.Serialization;

namespace WeatherApi.Models;

public class WeatherResponse
{
    [JsonPropertyName("city")] public string City { get; set; } = string.Empty;
    [JsonPropertyName("country")] public string Country { get; set; } = string.Empty;
    [JsonPropertyName("temperature")] public double Temperature { get; set; }
    [JsonPropertyName("feelsLike")] public double FeelsLike { get; set; }
    [JsonPropertyName("humidity")] public int Humidity { get; set; }
    [JsonPropertyName("windSpeed")] public double WindSpeed { get; set; }
    [JsonPropertyName("description")] public string Description { get; set; } = string.Empty;
    [JsonPropertyName("icon")] public string Icon { get; set; } = string.Empty;
    [JsonPropertyName("lat")] public double Lat { get; set; }
    [JsonPropertyName("lon")] public double Lon { get; set; }
}
