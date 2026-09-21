namespace WeatherApi.Models;

public class ForecastResponse
{
    public List<HourlyItem> Hourly { get; set; } = [];
    public List<DailyItem> Daily { get; set; } = [];
}

public class HourlyItem
{
    public DateTime Time { get; set; }
    public double Temperature { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class DailyItem
{
    public DateTime Date { get; set; }
    public double TempMin { get; set; }
    public double TempMax { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double PrecipitationProbability { get; set; }
}