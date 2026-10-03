using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using WeatherApi.Models;
using WeatherApi.Services;

namespace WeatherApi.Functions;

public class WeatherFunction
{
    private readonly IWeatherService _weather;
    private readonly ILogger<WeatherFunction> _logger;

    public WeatherFunction(IWeatherService weather, ILogger<WeatherFunction> logger)
    {
        _weather = weather;
        _logger = logger;
    }

    [Function("GetWeather")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "weather")] HttpRequestData req)
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
            WeatherResponse result;
            if (!string.IsNullOrEmpty(latStr) && double.TryParse(latStr, out var lat) && double.TryParse(lonStr, out var lon))
                result = await _weather.GetCurrentByCoordsAsync(lat, lon);
            else
                result = await _weather.GetCurrentAsync(city!);
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(result);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching weather for {City}", city);
            var error = req.CreateResponse(HttpStatusCode.InternalServerError);
            await error.WriteStringAsync("Failed to fetch weather data.");
            return error;
        }
    }
}