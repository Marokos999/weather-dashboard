using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace WeatherApi.Functions;

public class MapTileFunction
{
    private readonly HttpClient _http;
    private readonly string _apiKey;

    public MapTileFunction(IHttpClientFactory factory, IConfiguration config)
    {
        _http = factory.CreateClient();
        _apiKey = config["OWM_API_KEY"]
            ?? throw new InvalidOperationException("OWM_API_KEY configuration is missing.");
    }

    [Function("GetMapTile")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "map/{layer}/{z}/{x}/{y}")] HttpRequestData req,
        string layer, int z, int x, int y)
    {
        var allowedLayers = new HashSet<string> { "precipitation_new", "wind_new", "temp_new", "clouds_new" };
        if (!allowedLayers.Contains(layer))
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            await bad.WriteStringAsync("Invalid layer.");
            return bad;
        }

        var url = $"https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={_apiKey}";
        var tile = await _http.GetAsync(url);

        if (!tile.IsSuccessStatusCode)
        {
            return req.CreateResponse(HttpStatusCode.BadGateway);
        }

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "image/png");
        response.Headers.Add("Cache-Control", "public, max-age=600");
        var bytes = await tile.Content.ReadAsByteArrayAsync();
        await response.Body.WriteAsync(bytes);
        return response;
    }
}
