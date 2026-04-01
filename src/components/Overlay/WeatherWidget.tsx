import { useWeatherData, getWeatherLabel, getWeatherIcon, getAqiLabel, getAqiColor } from '../../hooks/useWeatherData'

export default function WeatherWidget() {
  const { data } = useWeatherData()

  if (!data) return null

  const aqiColor = getAqiColor(data.aqi)

  return (
    <div
      className="fixed top-14 right-[385px] z-40 flex items-center gap-3 px-4 py-2 rounded-lg"
      style={{
        background: 'rgba(10,10,10,0.9)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-lg">{getWeatherIcon(data.weatherCode)}</span>
        <div>
          <div className="text-sm font-bold text-white font-mono">{data.temperature}°F</div>
          <div className="text-[9px] uppercase tracking-wider" style={{ color: '#666' }}>{getWeatherLabel(data.weatherCode)}</div>
        </div>
      </div>

      <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.08)' }} />

      <div className="text-center">
        <div className="text-xs font-mono text-white">{data.windSpeed} mph</div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: '#666' }}>Wind</div>
      </div>

      <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.08)' }} />

      <div className="text-center">
        <div className="text-xs font-mono font-bold" style={{ color: aqiColor }}>{data.aqi}</div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: aqiColor }}>{getAqiLabel(data.aqi)}</div>
      </div>

      <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.08)' }} />

      <div className="text-center">
        <div className="text-xs font-mono text-white">{data.pm25}</div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: '#666' }}>PM2.5</div>
      </div>
    </div>
  )
}
