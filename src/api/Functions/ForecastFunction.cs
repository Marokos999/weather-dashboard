using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using WeatherApi.Services;

namespace WeatherApi.Functions;

public class ForecastFunction
{
    private readonly IWeatherService _weather;
    private readonly ILogger<ForecastFunction> _logger;

    public ForecastFunction(IWeatherService weather, ILogger<ForecastFunction> logger)
    {
        _weather = weather;
        _logger = logger;
    }

    [Function("GetForecast")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "forecast")] HttpRequestData req)
    {
        if (!double.TryParse(req.Query["lat"], out var lat) ||
            !double.TryParse(req.Query["lon"], out var lon))
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            await bad.WriteStringAsync("Query params 'lat' and 'lon' are required.");
            return bad;
        }

        try
        {
            var result = await _weather.GetForecastAsync(lat, lon);
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(result);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching forecast for {Lat},{Lon}", lat, lon);
            var error = req.CreateResponse(HttpStatusCode.InternalServerError);
            await error.WriteStringAsync("Failed to fetch forecast data.");
            return error;
        }
    }
}