import { useWeatherData, getWeatherLabel, getWeatherIcon, getAqiLabel, getAqiColor } from '../../hooks/useWeatherData'
import { useDashboardStore } from '../../store/dashboardStore'

export default function WeatherWidget({ inline }: { inline?: boolean }) {
  const { data } = useWeatherData()
  const dark = useDashboardStore((s) => s.darkMode)

  if (!data) return null

  const aqiColor = getAqiColor(data.aqi)

  const content = (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-lg">{getWeatherIcon(data.weatherCode)}</span>
        <div>
          <div className="text-sm font-bold font-mono" style={{ color: dark ? '#fff' : '#111' }}>{data.temperature}°F</div>
          <div className="text-[9px] uppercase tracking-wider" style={{ color: dark ? '#666' : '#999' }}>{getWeatherLabel(data.weatherCode)}</div>
        </div>
      </div>
      <div className="w-px h-8" style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
      <div className="text-center">
        <div className="text-xs font-mono" style={{ color: dark ? '#fff' : '#111' }}>{data.windSpeed} mph</div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: dark ? '#666' : '#999' }}>Wind</div>
      </div>
      <div className="w-px h-8" style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
      <div className="text-center">
        <div className="text-xs font-mono font-bold" style={{ color: aqiColor }}>{data.aqi}</div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: aqiColor }}>{getAqiLabel(data.aqi)}</div>
      </div>
      <div className="w-px h-8" style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
      <div className="text-center">
        <div className="text-xs font-mono" style={{ color: dark ? '#fff' : '#111' }}>{data.pm25}</div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: dark ? '#666' : '#999' }}>PM2.5</div>
      </div>
    </div>
  )

  if (inline) {
    return (
      <div className="rounded-lg" style={{ padding: 10, background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
        {content}
      </div>
    )
  }

  return (
    <div
      className="fixed top-14 right-[385px] z-40 flex items-center gap-3 px-4 py-2 rounded-lg"
      style={{
        background: dark ? 'rgba(10,10,10,0.9)' : 'rgba(255,255,255,0.9)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {content}
    </div>
  )
}
