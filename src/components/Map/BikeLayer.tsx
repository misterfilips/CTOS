import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import { useBikeStations, useBikeStatus } from '../../hooks/useBikeData'
import { useDashboardStore } from '../../store/dashboardStore'

export default function BikeLayer() {
  const { data: stations } = useBikeStations()
  const { data: statuses } = useBikeStatus()
  const visible = useDashboardStore((s) => s.layers.bike)

  const geojson = useMemo(() => {
    if (!stations || !statuses) return null
    const statusMap = new Map(statuses.map((s) => [s.station_id, s]))
    const features = stations
      .map((st) => {
        const status = statusMap.get(st.station_id)
        if (!status || !st.lat || !st.lon) return null
        const bikes = status.num_bikes_available
        const docks = status.num_docks_available
        const total = bikes + docks
        const pct = total > 0 ? bikes / total : 0
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [st.lon, st.lat] },
          properties: {
            name: st.name,
            bikes: String(bikes),
            docks: String(docks),
            avail: pct > 0.3 ? 'good' : pct > 0.1 ? 'low' : 'empty',
          },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection' as const, features }
  }, [stations, statuses])

  if (!visible || !geojson) return null

  return (
    <Source id="bike-src" type="geojson" data={geojson} cluster clusterMaxZoom={13} clusterRadius={40}>
      <Layer id="bike-clusters" type="circle" filter={['has', 'point_count']}
        paint={{
          'circle-color': '#00ff88',
          'circle-radius': ['step', ['get', 'point_count'], 12, 50, 18, 200, 24],
          'circle-opacity': 0.5,
        }}
      />
      <Layer id="bike-cluster-count" type="symbol" filter={['has', 'point_count']}
        layout={{ 'text-field': '{point_count_abbreviated}', 'text-font': ['Noto Sans Regular'], 'text-size': 11 }}
        paint={{ 'text-color': '#ffffff' }}
      />
      <Layer id="bike-point" type="circle" filter={['!', ['has', 'point_count']]}
        paint={{
          'circle-radius': 4,
          'circle-color': ['match', ['get', 'avail'], 'good', '#00ff88', 'low', '#ffaa00', '#ff3333'],
          'circle-opacity': 0.8,
        }}
      />
    </Source>
  )
}
