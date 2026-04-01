import { useQuery } from '@tanstack/react-query'

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  aqi: number
  pm25: number
  pm10: number
  no2: number
  ozone: number
}

function getWeatherLabel(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Cloudy'
  if (code <= 48) return 'Fog'
  if (code <= 57) return 'Drizzle'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Showers'
  if (code <= 86) return 'Snow Showers'
  if (code >= 95) return 'Thunderstorm'
  return 'Unknown'
}

function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 57) return '🌧️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 86) return '🌨️'
  if (code >= 95) return '⛈️'
  return '🌡️'
}

function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy (Sensitive)'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#ffffff'
  if (aqi <= 100) return '#cccccc'
  if (aqi <= 150) return '#999999'
  if (aqi <= 200) return '#888888'
  if (aqi <= 300) return '#666666'
  return '#555555'
}

async function fetchWeather(): Promise<WeatherData> {
  const [weatherRes, aqiRes] = await Promise.all([
    fetch('https://api.open-meteo.com/v1/forecast?latitude=41.878&longitude=-87.629&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph'),
    fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=41.878&longitude=-87.629&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone'),
  ])
  const weather = await weatherRes.json()
  const aqi = await aqiRes.json()

  return {
    temperature: Math.round(weather.current?.temperature_2m ?? 0),
    humidity: weather.current?.relative_humidity_2m ?? 0,
    windSpeed: Math.round(weather.current?.wind_speed_10m ?? 0),
    weatherCode: weather.current?.weather_code ?? 0,
    aqi: aqi.current?.us_aqi ?? 0,
    pm25: aqi.current?.pm2_5 ?? 0,
    pm10: aqi.current?.pm10 ?? 0,
    no2: aqi.current?.nitrogen_dioxide ?? 0,
    ozone: aqi.current?.ozone ?? 0,
  }
}

export function useWeatherData() {
  return useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeather,
    refetchInterval: 10 * 60 * 1000, // 10 min
    staleTime: 9 * 60 * 1000,
  })
}

export { getWeatherLabel, getWeatherIcon, getAqiLabel, getAqiColor }
