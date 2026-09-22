using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StackExchange.Redis;
using WeatherApi.Services;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices((context, services) =>
    {
        services.AddHttpClient("openweather", client =>
        {
            client.BaseAddress = new Uri("https://api.openweathermap.org/data/2.5/");
        });

        var redisConn = context.Configuration["REDIS_CONNECTION_STRING"];
        services.AddSingleton<IConnectionMultiplexer?>(_ =>
        {
            if (string.IsNullOrEmpty(redisConn)) return null;
            try { return ConnectionMultiplexer.Connect(redisConn); }
            catch { return null; }
        });

        services.AddSingleton<IRedisCacheService, RedisCacheService>();
        services.AddScoped<IWeatherService, WeatherService>();
    })
    .Build();

host.Run();