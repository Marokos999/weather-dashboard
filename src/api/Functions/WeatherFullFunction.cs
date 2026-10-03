using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using WeatherApi.Models;
using WeatherApi.Services;

namespace WeatherApi.Functions;

public class WeatherFullFunction
{
    private readonly IWeatherService _weather;
    private readonly ILogger<WeatherFullFunction> _logger;

    public WeatherFullFunction(IWeatherService weather, ILogger<WeatherFullFunction> logger)
    {
        _weather = weather;
        _logger = logger;
    }

    [Function("GetWeatherFull")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "weather-full")] HttpRequestData req)
    {
        var city = req.Query["city"];
        var latStr = req.Query["lat"];
        var lonStr = req.Query["lon"];

        if (string.IsNullOrEmpty(city) && (string.IsNullOrEmpty(latStr) || string.IsNullOrEmpty(lonStr)))
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            await bad.WriteStringAsync("Query param 'city' or 'lat'+'lon' is required.");
            return bad;
        }

        try
        {
            WeatherResponse weatherData;

            if (!string.IsNullOrEmpty(latStr) && double.TryParse(latStr, out var lat) && double.TryParse(lonStr, out var lon))
            {
                var forecast = await _weather.GetForecastAsync(lat, lon);
                weatherData = await _weather.GetCurrentByCoordsAsync(lat, lon);
                var result = new WeatherFullResponse { Weather = weatherData, Forecast = forecast };
                var ok = req.CreateResponse(HttpStatusCode.OK);
                await ok.WriteAsJsonAsync(result);
                return ok;
            }
            else
            {
                weatherData = await _weather.GetCurrentAsync(city!);
                var forecast = await _weather.GetForecastAsync(weatherData.Lat, weatherData.Lon);
                var result = new WeatherFullResponse { Weather = weatherData, Forecast = forecast };
                var ok = req.CreateResponse(HttpStatusCode.OK);
                await ok.WriteAsJsonAsync(result);
                return ok;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching full weather for {Query}", city ?? $"{latStr},{lonStr}");
            var error = req.CreateResponse(HttpStatusCode.InternalServerError);
            await error.WriteStringAsync("Failed to fetch weather data.");
            return error;
        }
    }
}
