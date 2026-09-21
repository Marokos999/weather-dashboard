using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using WeatherApi.Services;

namespace WeatherApi.Functions;

public class GeocodeFunction
{
    private readonly IWeatherService _weather;
    private readonly ILogger<GeocodeFunction> _logger;

    public GeocodeFunction(IWeatherService weather, ILogger<GeocodeFunction> logger)
    {
        _weather = weather;
        _logger = logger;
    }

    [Function("Geocode")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "geocode")] HttpRequestData req)
    {
        var q = req.Query["q"];
        if (string.IsNullOrEmpty(q))
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            await bad.WriteStringAsync("Query param 'q' is required.");
            return bad;
        }

        try
        {
            var (lat, lon) = await _weather.GeocodeAsync(q);
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new { lat, lon });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Geocode failed for {Query}", q);
            var error = req.CreateResponse(HttpStatusCode.NotFound);
            await error.WriteStringAsync($"City not found: {q}");
            return error;
        }
    }
}