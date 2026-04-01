import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import { useSubwayData } from '../../hooks/useSubwayData'
import { useDashboardStore } from '../../store/dashboardStore'
import { SUBWAY_LINE_COLORS } from '../../utils/colors'

// Hardcoded key subway stations for display (a subset — full data from stops.txt)
const KEY_STATIONS: Record<string, [number, number]> = {
  '101': [-73.9581, 40.7903], // Van Cortlandt Park (1)
  '127': [-74.0032, 40.7327], // Christopher St (1)
  '142': [-74.0130, 40.7025], // South Ferry (1)
  '224': [-73.9440, 40.8040], // 149 St (2/5)
  '301': [-73.9732, 40.7862], // Harlem 125 (A/B/C/D)
  '401': [-73.9877, 40.7484], // Times Sq (N/Q/R/W)
  '631': [-73.9897, 40.7527], // Grand Central (4/5/6)
  '726': [-73.9895, 40.7346], // Union Sq (L/N/Q/R/W/4/5/6)
  '902': [-73.9498, 40.6318], // Church Av (B/Q)
  'A09': [-73.9846, 40.7684], // Columbus Circle (A/C/B/D/1)
  'A31': [-74.0002, 40.7196], // Canal St (A/C/E)
  'D13': [-73.9817, 40.7639], // 47-50 St Rock Ctr (B/D/F/M)
  'G08': [-73.9503, 40.7441], // Metropolitan Av (G)
  'L01': [-73.9907, 40.7348], // 14 St Union Sq (L)
  'L06': [-73.9439, 40.7149], // Bedford Av (L)
  'R01': [-74.0141, 40.7106], // Whitehall (R/W)
}

export default function SubwayLayer() {
  const { data } = useSubwayData()
  const visible = useDashboardStore((s) => s.layers.subway)

  const geojson = useMemo(() => {
    if (!data?.length) return null
    const seenRoutes = new Set<string>()
    const features = data
      .map((trip) => {
        if (!trip.routeId || seenRoutes.has(trip.routeId + trip.tripId)) return null
        seenRoutes.add(trip.routeId + trip.tripId)
        // Use first stop_time_update with a known station
        const update = trip.stopTimeUpdates?.find((s) => KEY_STATIONS[s.stopId?.substring(0, 3)])
        if (!update) return null
        const stationKey = update.stopId.substring(0, 3)
        const coords = KEY_STATIONS[stationKey]
        if (!coords) return null
        const color = SUBWAY_LINE_COLORS[trip.routeId] || '#00f0ff'
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: coords },
          properties: {
            route: trip.routeId,
            color,
          },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection' as const, features }
  }, [data])

  if (!visible || !geojson) return null

  return (
    <Source id="subway-src" type="geojson" data={geojson}>
      <Layer
        id="subway-glow"
        type="circle"
        paint={{
          'circle-radius': 12,
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.2,
          'circle-blur': 1,
        }}
      />
      <Layer
        id="subway-dot"
        type="circle"
        paint={{
          'circle-radius': 5,
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        }}
      />
      <Layer
        id="subway-label"
        type="symbol"
        layout={{
          'text-field': ['get', 'route'],
          'text-size': 10,
          'text-font': ['Noto Sans Regular'],
          'text-offset': [0, -1.5],
          'text-allow-overlap': true,
        }}
        paint={{
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        }}
      />
    </Source>
  )
}
