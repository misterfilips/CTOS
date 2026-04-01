import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import { useCameraData } from '../../hooks/useCameraData'
import { useDashboardStore } from '../../store/dashboardStore'
import { parseLatLng } from '../../utils/geo'

export default function CameraLayer() {
  const { data } = useCameraData()
  const visible = useDashboardStore((s) => s.layers.cameras)

  const geojson = useMemo(() => {
    if (!data) return null
    const features = data
      .map((d, i) => {
        const coord = parseLatLng(d.latitude, d.longitude)
        if (!coord) return null
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: coord },
          properties: {
            camType: d.type,
            intersection: d.intersection,
            approach: [d.first_approach, d.second_approach].filter(Boolean).join(', '),
            goLive: d.go_live_date || '',
            id: String(i),
          },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection' as const, features }
  }, [data])

  if (!visible || !geojson) return null

  return (
    <Source id="camera-src" type="geojson" data={geojson}>
      <Layer id="camera-glow" type="circle"
        paint={{
          'circle-radius': 10,
          'circle-color': '#7a9e9e',
          'circle-opacity': 0.08, 'circle-blur': 1,
        }}
      />
      <Layer id="camera-dot" type="circle"
        paint={{
          'circle-radius': 8,
          'circle-color': '#7a9e9e',
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#7a9e9e',
        }}
      />
      <Layer id="camera-icon" type="symbol"
        layout={{
          'text-field': '📹',
          'text-size': 11,
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        }}
      />
    </Source>
  )
}
