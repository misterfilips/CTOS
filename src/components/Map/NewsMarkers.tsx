import { useMemo } from 'react'
import { Marker } from 'react-map-gl/maplibre'
import { useNewsData } from '../../hooks/useNewsData'
import { useDashboardStore } from '../../store/dashboardStore'

const BOROUGH_COORDS: Record<string, [number, number]> = {
  manhattan: [-73.97, 40.78],
  brooklyn: [-73.95, 40.65],
  queens: [-73.82, 40.73],
  bronx: [-73.87, 40.85],
  'staten island': [-74.15, 40.58],
}

function matchBorough(text: string): [number, number] | null {
  const lower = text.toLowerCase()
  for (const [boro, coords] of Object.entries(BOROUGH_COORDS)) {
    if (lower.includes(boro)) return coords
  }
  return null
}

export default function NewsMarkers() {
  const { data: articles } = useNewsData()
  const visible = useDashboardStore((s) => s.layers.news)

  const placedArticles = useMemo(() => {
    if (!articles) return []
    return articles
      .map((a) => {
        const coords = matchBorough(a.title + ' ' + a.description)
        if (!coords) return null
        return { ...a, coords }
      })
      .filter(Boolean)
      .slice(0, 5)
  }, [articles])

  if (!visible || !placedArticles.length) return null

  return (
    <>
      {placedArticles.map((a, i) => (
        <Marker key={i} longitude={a!.coords[0]} latitude={a!.coords[1]} anchor="bottom">
          <div
            className="max-w-[200px] p-2 rounded-lg text-xs cursor-pointer news-float"
            style={{
              background: 'rgba(15,15,35,0.9)',
              border: '1px solid rgba(187,102,255,0.3)',
              boxShadow: '0 0 10px rgba(187,102,255,0.2)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <div className="text-purple-300 font-medium line-clamp-2">{a!.title}</div>
            <div className="text-gray-500 mt-1">{a!.source.name}</div>
          </div>
        </Marker>
      ))}
    </>
  )
}
