import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import { useShootingData } from '../../hooks/useShootingData'
import { useDashboardStore } from '../../store/dashboardStore'
import { parseLatLng, getTimeCutoff, passesTimeFilter } from '../../utils/geo'

export default function ShootingLayer() {
  const { data } = useShootingData()
  const visible = useDashboardStore((s) => s.layers.shootings)
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
        const isHomicide = d.victimization_primary?.toUpperCase() === 'HOMICIDE'
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: coord },
          properties: {
            victimization: d.victimization_primary || '',
            incidentType: d.incident_iucr_secondary || d.incident_primary || '',
            date: d.date || '',
            age: d.age || '',
            sex: d.sex || '',
            race: d.race || '',
            locationDesc: d.location_description || '',
            ward: d.ward || '',
            district: d.district || '',
            isHomicide: String(isHomicide),
            id: d.unique_id || d.case_number || '',
          },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection' as const, features }
  }, [data, selectedBorough, timeRange, liveTick])

  if (!visible || !geojson) return null

  return (
    <Source id="shooting-src" type="geojson" data={geojson}>
      <Layer id="shooting-ring" type="circle"
        paint={{ 'circle-radius': 18, 'circle-color': '#b84040', 'circle-opacity': 0.12, 'circle-blur': 1 }}
      />
      <Layer id="shooting-dot" type="circle"
        paint={{
          'circle-radius': 8, 'circle-color': '#b84040', 'circle-opacity': 0.95,
          'circle-stroke-width': 2.5,
          'circle-stroke-color': ['match', ['get', 'isHomicide'], 'true', '#ffffff', '#886666'],
        }}
      />
    </Source>
  )
}
