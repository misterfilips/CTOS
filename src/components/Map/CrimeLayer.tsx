import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import { useCrimeData } from '../../hooks/useCrimeData'
import { useDashboardStore } from '../../store/dashboardStore'
import { parseLatLng, getTimeCutoff, passesTimeFilter } from '../../utils/geo'

export default function CrimeLayer() {
  const { data } = useCrimeData()
  const visible = useDashboardStore((s) => s.layers.crime)
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
        if (selectedBorough && d.district !== selectedBorough) return null
        if (!passesTimeFilter(d.date, cutoff)) return null
        const isArrest = d.arrest === 'true'
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: coord },
          properties: {
            primaryType: d.primary_type || 'UNKNOWN',
            description: d.description || '',
            locationDesc: d.location_description || '',
            arrest: String(isArrest),
            domestic: d.domestic || 'false',
            block: d.block || '',
            ward: d.ward || '',
            district: d.district || '',
            date: d.date || '',
            id: d.id || d.case_number || '',
          },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection' as const, features }
  }, [data, selectedBorough, timeRange, liveTick])

  if (!visible || !geojson) return null

  return (
    <Source id="crime-src" type="geojson" data={geojson}>
      <Layer id="crime-glow" type="circle"
        paint={{
          'circle-radius': 14, 'circle-color': '#c45c5c',
          'circle-opacity': 0.08, 'circle-blur': 1,
        }}
      />
      <Layer id="crime-arrest" type="circle" filter={['==', ['get', 'arrest'], 'true']}
        paint={{ 'circle-radius': 6, 'circle-color': '#c45c5c', 'circle-opacity': 0.9, 'circle-stroke-width': 1.5, 'circle-stroke-color': 'rgba(196,92,92,0.4)' }}
      />
      <Layer id="crime-dot" type="circle" filter={['==', ['get', 'arrest'], 'false']}
        paint={{ 'circle-radius': 4, 'circle-color': '#c45c5c', 'circle-opacity': 0.5, 'circle-stroke-width': 1, 'circle-stroke-color': 'rgba(196,92,92,0.2)' }}
      />
    </Source>
  )
}
