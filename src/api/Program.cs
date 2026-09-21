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

        var redisConn = context.Configuration["REDIS_CONNECTION_STRING"] ?? "localhost:6379";
        services.AddSingleton<IConnectionMultiplexer>(_ =>
            ConnectionMultiplexer.Connect(redisConn));

        services.AddSingleton<IRedisCacheService, RedisCacheService>();
        services.AddScoped<IWeatherService, WeatherService>();
    })
    .Build();

host.Run();