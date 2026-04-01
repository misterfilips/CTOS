import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import { usePotholeData } from '../../hooks/usePotholeData'
import { useDashboardStore } from '../../store/dashboardStore'
import { parseLatLng } from '../../utils/geo'

export default function PotholeLayer() {
  const { data } = usePotholeData()
  const visible = useDashboardStore((s) => s.layers.potholes)

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
            address: d.street_address || '',
            status: d.status || '',
            date: d.created_date || '',
            id: d.sr_number || String(i),
          },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection' as const, features }
  }, [data])

  if (!visible || !geojson) return null

  return (
    <Source id="pothole-src" type="geojson" data={geojson}>
      {/* Heatmap at lower zooms */}
      <Layer id="pothole-heat" type="heatmap"
        maxzoom={14}
        paint={{
          'heatmap-weight': 1,
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 9, 1, 14, 3],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 9, 8, 14, 25],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, 'rgba(180,140,80,0.2)',
            0.4, 'rgba(180,130,70,0.35)',
            0.6, 'rgba(170,120,60,0.5)',
            0.8, 'rgba(160,110,50,0.7)',
            1, 'rgba(200,150,80,0.85)',
          ],
          'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 14, 0.3],
        }}
      />
      {/* Individual dots at higher zooms */}
      <Layer id="pothole-dot" type="circle"
        minzoom={12}
        paint={{
          'circle-radius': 3,
          'circle-color': '#aa8844',
          'circle-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 14, 0.7],
          'circle-stroke-width': 1,
          'circle-stroke-color': 'rgba(255,255,255,0.15)',
        }}
      />
    </Source>
  )
}
