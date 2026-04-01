import { useMemo, useState, useCallback } from 'react'
import { Source, Layer, Popup } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre'
import { useRestaurantData } from '../../hooks/useRestaurantData'
import { useDashboardStore } from '../../store/dashboardStore'
import { parseLatLng } from '../../utils/geo'

export default function RestaurantLayer() {
  const { data } = useRestaurantData()
  const visible = useDashboardStore((s) => s.layers.restaurant)
  const [popup, setPopup] = useState<{ lng: number; lat: number; props: Record<string, string> } | null>(null)

  const geojson = useMemo(() => {
    if (!data) return null
    const features = data
      .map((d) => {
        const coord = parseLatLng(d.latitude, d.longitude)
        if (!coord) return null
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: coord },
          properties: {
            name: d.dba || 'Unknown',
            grade: d.grade || 'N/A',
            cuisine: d.cuisine_description || '',
            violation: d.violation_description || '',
            score: d.score || '',
            address: `${d.building || ''} ${d.street || ''}`.trim(),
          },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection' as const, features }
  }, [data])

  const onClick = useCallback((e: MapLayerMouseEvent) => {
    const f = e.features?.[0]
    if (!f) return
    const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates
    setPopup({ lng, lat, props: f.properties as Record<string, string> })
  }, [])

  if (!visible || !geojson) return null

  return (
    <>
      <Source id="restaurant-src" type="geojson" data={geojson}>
        <Layer
          id="restaurant-dot"
          type="circle"
          paint={{
            'circle-radius': 5,
            'circle-color': [
              'match', ['get', 'grade'],
              'A', '#00ff88',
              'B', '#ffaa00',
              'C', '#ff3333',
              '#8892b0',
            ],
            'circle-opacity': 0.8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff33',
          }}
          onClick={onClick}
        />
      </Source>
      {popup && (
        <Popup longitude={popup.lng} latitude={popup.lat} onClose={() => setPopup(null)} closeButton={false} maxWidth="300px">
          <div className="p-3 rounded-lg" style={{ background: 'rgba(15,15,35,0.95)', border: '1px solid #ffaa00', fontFamily: 'Inter, sans-serif' }}>
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-lg font-bold px-2 py-0.5 rounded"
                style={{
                  color: popup.props.grade === 'A' ? '#00ff88' : popup.props.grade === 'B' ? '#ffaa00' : '#ff3333',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                {popup.props.grade}
              </span>
              <button onClick={() => setPopup(null)} className="text-gray-500 hover:text-white text-sm">✕</button>
            </div>
            <div className="text-sm font-medium text-white mb-1">{popup.props.name}</div>
            <div className="text-xs text-gray-400 mb-1">{popup.props.cuisine}</div>
            <div className="text-xs text-gray-500">{popup.props.address}</div>
            {popup.props.violation && (
              <div className="text-xs text-red-400/70 mt-2 line-clamp-2">{popup.props.violation}</div>
            )}
          </div>
        </Popup>
      )}
    </>
  )
}
