namespace WeatherApi.Models;

public class WeatherResponse
{
  public string City { get; set; } = string.Empty;
  public string Country { get; set; } = string.Empty;
  public double Temperature { get; set; }
  public double FeelsLike { get; set; }
  public int Humidity { get; set; }
  public double WindSpeed { get; set; }
  public string Description { get; set; } = string.Empty;
  public string Icon { get; set; } = string.Empty;
  public double Lat { get; set; }
  public double Lon { get; set; }
}