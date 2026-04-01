import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import { useCollisionData } from '../../hooks/useCollisionData'
import { useDashboardStore } from '../../store/dashboardStore'
import { parseLatLng, getTimeCutoff, passesTimeFilter } from '../../utils/geo'

export default function CollisionLayer() {
  const { data } = useCollisionData()
  const visible = useDashboardStore((s) => s.layers.collisions)
  const selectedBorough = useDashboardStore((s) => s.selectedBorough)
  const timeRange = useDashboardStore((s) => s.timeRangeHours)
  const liveTick = useDashboardStore((s) => s.liveTick)

  const geojson = useMemo(() => {
    if (!data) return null
    const cutoff = getTimeCutoff(timeRange)
    const features = data
      .map((d, idx) => {
        const coord = parseLatLng(d.latitude, d.longitude)
        if (!coord) return null
        if (selectedBorough && d.beat_of_occurrence !== selectedBorough) return null
        if (!passesTimeFilter(d.crash_date, cutoff)) return null
        const injured = parseInt(d.injuries_total) || 0
        const fatal = parseInt(d.injuries_fatal) || 0
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: coord },
          properties: {
            injured: String(injured),
            fatal: String(fatal),
            severity: String(Math.min(injured + fatal * 3, 10)),
            cause: d.prim_contributory_cause || '',
            crashType: d.first_crash_type || '',
            weather: d.weather_condition || '',
            date: d.crash_date || '',
            id: d.crash_record_id || String(idx),
          },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection' as const, features }
  }, [data, selectedBorough, timeRange, liveTick])

  if (!visible || !geojson) return null

  return (
    <Source id="collision-src" type="geojson" data={geojson}>
      <Layer id="collision-glow" type="circle"
        paint={{
          'circle-radius': ['*', ['to-number', ['get', 'severity'], 1], 4],
          'circle-color': '#b8963c', 'circle-opacity': 0.08, 'circle-blur': 1,
        }}
      />
      <Layer id="collision-dot" type="circle"
        paint={{
          'circle-radius': ['max', ['*', ['to-number', ['get', 'severity'], 1], 2], 4],
          'circle-color': '#b8963c', 'circle-opacity': 0.7,
          'circle-stroke-width': 1, 'circle-stroke-color': '#998844',
        }}
      />
    </Source>
  )
}
