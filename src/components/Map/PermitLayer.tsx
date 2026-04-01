import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import { usePermitData } from '../../hooks/usePermitData'
import { useDashboardStore } from '../../store/dashboardStore'
import { parseLatLng } from '../../utils/geo'

export default function PermitLayer() {
  const { data } = usePermitData()
  const visible = useDashboardStore((s) => s.layers.permits)

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
            permitType: d.permit_type || '',
            address: `${d.street_number || ''} ${d.street_direction || ''} ${d.street_name || ''}`.trim(),
            description: (d.work_description || '').substring(0, 120),
            date: d.issue_date || '',
            id: d.id || String(i),
          },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection' as const, features }
  }, [data])

  if (!visible || !geojson) return null

  return (
    <Source id="permit-src" type="geojson" data={geojson}>
      <Layer id="permit-glow" type="circle"
        paint={{ 'circle-radius': 8, 'circle-color': '#6a9a7a', 'circle-opacity': 0.06, 'circle-blur': 1 }}
      />
      <Layer id="permit-dot" type="circle"
        paint={{
          'circle-radius': 4,
          'circle-color': '#6a9a7a',
          'circle-opacity': 0.5,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#557766',
        }}
      />
    </Source>
  )
}
