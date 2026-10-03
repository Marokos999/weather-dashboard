using WeatherApi.Models;

namespace WeatherApi.Services;

public interface IWeatherService
{
    Task<WeatherResponse> GetCurrentAsync(string city);
    Task<WeatherResponse> GetCurrentByCoordsAsync(double lat, double lon);
    Task<ForecastResponse> GetForecastAsync(double lat, double lon);
    Task<(double Lat, double Lon)> GeocodeAsync(string query);
}