import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import { use311Data } from '../../hooks/use311Data'
import { useDashboardStore } from '../../store/dashboardStore'
import { parseLatLng, getTimeCutoff, passesTimeFilter } from '../../utils/geo'

export default function ServiceLayer() {
  const { data } = use311Data()
  const visible = useDashboardStore((s) => s.layers.service311)
  const selectedBorough = useDashboardStore((s) => s.selectedBorough)
  const timeRange = useDashboardStore((s) => s.timeRangeHours)
  const liveTick = useDashboardStore((s) => s.liveTick)

  const geojson = useMemo(() => {
    if (!data) return null
    const cutoff = getTimeCutoff(timeRange)
    const features = data
      .map((d) => {
        const coord = parseLatLng(d.latitude, d.longitude)
        if (!coord) return null
        if (selectedBorough && d.ward !== selectedBorough) return null
        if (!passesTimeFilter(d.created_date, cutoff)) return null
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: coord },
          properties: {
            type: d.sr_type || 'Unknown',
            status: d.status || '',
            address: d.street_address || '',
            ward: d.ward || '',
            date: d.created_date || '',
            id: d.sr_number,
          },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection' as const, features }
  }, [data, selectedBorough, timeRange, liveTick])

  if (!visible || !geojson) return null

  return (
    <Source id="311-src" type="geojson" data={geojson} cluster clusterMaxZoom={14} clusterRadius={50}>
      <Layer id="311-clusters" type="circle" filter={['has', 'point_count']}
        paint={{
          'circle-color': '#6688aa',
          'circle-radius': ['step', ['get', 'point_count'], 15, 50, 22, 200, 30],
          'circle-opacity': 0.5, 'circle-blur': 0.3,
        }}
      />
      <Layer id="311-cluster-count" type="symbol" filter={['has', 'point_count']}
        layout={{ 'text-field': '{point_count_abbreviated}', 'text-font': ['Noto Sans Regular'], 'text-size': 12 }}
        paint={{ 'text-color': '#ffffff' }}
      />
      <Layer id="311-point" type="circle" filter={['!', ['has', 'point_count']]}
        paint={{ 'circle-radius': 3, 'circle-color': '#6688aa', 'circle-opacity': 0.5, 'circle-blur': 0.3 }}
      />
      <Layer id="311-glow" type="circle" filter={['!', ['has', 'point_count']]}
        paint={{ 'circle-radius': 10, 'circle-color': '#6688aa', 'circle-opacity': 0.06, 'circle-blur': 1 }}
      />
    </Source>
  )
}
