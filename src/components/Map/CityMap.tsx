import { useRef, useCallback, useEffect, useState } from 'react'
import Map, { Popup, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { LngLatBoundsLike } from 'maplibre-gl'
import type maplibregl from 'maplibre-gl'
import { useDashboardStore } from '../../store/dashboardStore'
import { DARK_STYLE, DARK_STYLE_3D, LIGHT_STYLE, MAP_CINEMATIC_START, MAP_INITIAL_VIEW, add3DBuildingLayer } from '../../utils/mapStyles'
import CrimeLayer from './CrimeLayer'
import ShootingLayer from './ShootingLayer'
import ServiceLayer from './ServiceLayer'
import CollisionLayer from './CollisionLayer'
import CameraLayer from './CameraLayer'
import PermitLayer from './PermitLayer'
import PotholeLayer from './PotholeLayer'
import NewsMarkers from './NewsMarkers'
import { formatDistanceToNow } from 'date-fns'

// Chicago bounding box — tighter to keep focus on the city
const CITY_BOUNDS: LngLatBoundsLike = [
  [-87.88, 41.68], // SW corner
  [-87.52, 42.02], // NE corner
]

const CLICKABLE_LAYERS = [
  'crime-dot', 'crime-arrest',
  'shooting-dot', '311-point', 'collision-dot',
  'camera-dot', 'permit-dot', 'pothole-dot',
]

interface PopupData {
  lng: number
  lat: number
  props: Record<string, string>
  layerId: string
}

function getPopupColor(layerId: string): string {
  if (layerId.startsWith('crime')) return '#ff3366'
  if (layerId.startsWith('shooting')) return '#ff0033'
  if (layerId.startsWith('311')) return '#4488ff'
  if (layerId.startsWith('collision')) return '#ff8800'
  if (layerId.startsWith('camera')) return '#ff00cc'
  if (layerId.startsWith('permit')) return '#00ffcc'
  if (layerId.startsWith('pothole')) return '#ff6600'
  return '#00f0ff'
}

function getPopupTitle(layerId: string, props: Record<string, string>): string {
  if (layerId.startsWith('crime')) return `${props.primaryType || 'CRIME'}: ${props.description || ''}`
  if (layerId.startsWith('shooting')) return props.victimization === 'HOMICIDE' ? 'FATAL SHOOTING' : 'SHOOTING VICTIM'
  if (layerId.startsWith('311')) return props.type || '311 Request'
  if (layerId.startsWith('collision')) return `CRASH — ${props.injured || 0} injured${props.fatal !== '0' ? `, ${props.fatal} fatal` : ''}`
  if (layerId.startsWith('camera')) return `📹 ${props.camType === 'red_light' ? 'RED LIGHT CAMERA' : 'SPEED CAMERA'}`
  if (layerId.startsWith('permit')) return `🏗️ ${props.permitType || 'Building Permit'}`
  if (layerId.startsWith('pothole')) return `🕳️ POTHOLE REPORT`
  return 'Incident'
}

function getPopupDetails(layerId: string, props: Record<string, string>): string[] {
  const details: string[] = []
  if (props.ward) details.push(`Ward ${props.ward}`)
  if (props.district) details.push(`District ${props.district}`)
  if (layerId.startsWith('crime')) {
    if (props.locationDesc) details.push(props.locationDesc)
    if (props.arrest === 'true') details.push('✓ Arrest made')
    if (props.domestic === 'true') details.push('Domestic')
    if (props.block) details.push(props.block)
  }
  if (layerId.startsWith('311')) {
    if (props.status) details.push(`Status: ${props.status}`)
    if (props.address) details.push(props.address)
  }
  if (layerId.startsWith('collision')) {
    if (props.cause) details.push(props.cause)
    if (props.weather) details.push(`Weather: ${props.weather}`)
    if (props.crashType) details.push(props.crashType)
  }
  if (layerId.startsWith('shooting')) {
    if (props.age) details.push(`Victim: ${props.age} ${props.sex || ''}`)
    if (props.locationDesc) details.push(props.locationDesc)
    if (props.incidentType) details.push(props.incidentType)
  }
  if (layerId.startsWith('camera')) {
    if (props.intersection) details.push(props.intersection)
    if (props.approach) details.push(`Approach: ${props.approach}`)
    if (props.goLive) details.push(`Since: ${new Date(props.goLive).toLocaleDateString()}`)
  }
  if (layerId.startsWith('permit')) {
    if (props.address) details.push(props.address)
    if (props.description) details.push(props.description)
  }
  if (layerId.startsWith('pothole')) {
    if (props.address) details.push(props.address)
    if (props.status) details.push(`Status: ${props.status}`)
  }
  return details
}

export default function CityMap() {
  const mapRef = useRef<MapRef>(null)
  const setIntroComplete = useDashboardStore((s) => s.setIntroComplete)
  const buildings3d = useDashboardStore((s) => s.layers.buildings3d)
  const [interacting, setInteracting] = useState(false)
  const rotationRef = useRef<number | null>(null)
  const [popup, setPopup] = useState<PopupData | null>(null)
  const [clusterList, setClusterList] = useState<{ lng: number; lat: number; items: Record<string, string>[] } | null>(null)

  const darkMode = useDashboardStore((s) => s.darkMode)
  const mapStyle = !darkMode ? LIGHT_STYLE : buildings3d ? DARK_STYLE_3D : DARK_STYLE

  const onLoad = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    add3DBuildingLayer(map)

    // Cinematic fly-in from zoomed out to NYC
    map.easeTo({
      center: [MAP_INITIAL_VIEW.longitude, MAP_INITIAL_VIEW.latitude],
      zoom: MAP_INITIAL_VIEW.zoom,
      pitch: MAP_INITIAL_VIEW.pitch,
      bearing: MAP_INITIAL_VIEW.bearing,
      duration: 4000,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    })

    setTimeout(() => setIntroComplete(true), 4500)
  }, [setIntroComplete])

  // Handle clicks on data layers
  const onClick = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap()
    if (!map) return

    // Check for cluster clicks first
    try {
      const clusterFeatures = map.queryRenderedFeatures(e.point, { layers: ['311-clusters'] })
      if (clusterFeatures?.length) {
        const cluster = clusterFeatures[0]
        const clusterId = cluster.properties?.cluster_id
        const source = map.getSource('311-src') as maplibregl.GeoJSONSource | undefined
        if (source && clusterId != null) {
          // Get the cluster expansion zoom
          source.getClusterExpansionZoom(clusterId).then((zoom: number) => {
            const geom = cluster.geometry
            if (geom.type !== 'Point') return
            const [lng, lat] = geom.coordinates as [number, number]

            // If already at max zoom or close, show the list instead
            if (zoom >= 14 || map.getZoom() >= 13.5) {
              source.getClusterLeaves(clusterId, 50, 0).then((leaves: GeoJSON.Feature[]) => {
                const items = leaves.map(l => (l.properties || {}) as Record<string, string>)
                setClusterList({ lng, lat, items })
                setPopup(null)
              })
            } else {
              // Zoom in to expand
              map.easeTo({ center: [lng, lat], zoom: zoom + 0.5, duration: 500 })
              setClusterList(null)
            }
          })
          return
        }
      }
    } catch { /* cluster layer may not exist */ }

    setClusterList(null)

    const features = map.queryRenderedFeatures(e.point, {
      layers: CLICKABLE_LAYERS.filter(id => {
        try { return !!map.getLayer(id) } catch { return false }
      }),
    })

    if (!features?.length) {
      setPopup(null)
      return
    }
    const feature = features[0]
    const geom = feature.geometry
    if (geom.type !== 'Point') return
    const [lng, lat] = geom.coordinates as [number, number]
    const layerId = feature.layer?.id || ''
    const props = (feature.properties || {}) as Record<string, string>

    // Route camera clicks to the store (CameraLayer handles its own popup)
    if (layerId.startsWith('camera')) {
      useDashboardStore.getState().setSelectedCamera({ lng, lat, props })
      return
    }

    setPopup({ lng, lat, props, layerId })
  }, [])

  // Idle auto-rotate
  useEffect(() => {
    if (interacting) {
      if (rotationRef.current) cancelAnimationFrame(rotationRef.current)
      return
    }
    let bearing = MAP_INITIAL_VIEW.bearing
    const rotate = () => {
      const map = mapRef.current?.getMap()
      if (map && !interacting) {
        bearing += 0.03
        map.setBearing(bearing)
      }
      rotationRef.current = requestAnimationFrame(rotate)
    }
    const timeout = setTimeout(() => {
      rotationRef.current = requestAnimationFrame(rotate)
    }, 10000)
    return () => {
      clearTimeout(timeout)
      if (rotationRef.current) cancelAnimationFrame(rotationRef.current)
    }
  }, [interacting])

  return (
    <Map
      ref={mapRef}
      initialViewState={MAP_CINEMATIC_START}
      style={{ width: '100%', height: '100vh' }}
      mapStyle={mapStyle}
      maxBounds={CITY_BOUNDS}
      minZoom={9}
      maxZoom={18}
      antialias
      onLoad={onLoad}
      onClick={onClick}
      onMouseDown={() => setInteracting(true)}
      onTouchStart={() => setInteracting(true)}
      onMouseUp={() => setTimeout(() => setInteracting(false), 5000)}
      onTouchEnd={() => setTimeout(() => setInteracting(false), 5000)}
      cursor="pointer"
    >
      <CrimeLayer />
      <ShootingLayer />
      <ServiceLayer />
      <CollisionLayer />
      <CameraLayer />
      <PermitLayer />
      <PotholeLayer />
      <NewsMarkers />

      {popup && (
        <Popup
          longitude={popup.lng}
          latitude={popup.lat}
          onClose={() => setPopup(null)}
          closeButton={false}
          maxWidth="320px"
          anchor="bottom"
        >
          <div
            className="p-3 rounded-lg min-w-[200px]"
            style={{
              background: 'rgba(10,10,25,0.95)',
              border: `1px solid ${getPopupColor(popup.layerId)}`,
              boxShadow: `0 0 15px ${getPopupColor(popup.layerId)}40`,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider"
                style={{
                  background: getPopupColor(popup.layerId) + '25',
                  color: getPopupColor(popup.layerId),
                }}
              >
                {popup.layerId.split('-')[0]}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setPopup(null) }}
                className="text-gray-500 hover:text-white text-sm ml-2"
              >
                ✕
              </button>
            </div>
            <div className="text-sm font-medium text-white mb-1">
              {getPopupTitle(popup.layerId, popup.props)}
            </div>
            {getPopupDetails(popup.layerId, popup.props).map((d, i) => (
              <div key={i} className="text-xs text-gray-400">{d}</div>
            ))}
            {popup.props.date && (
              <div className="text-[10px] text-gray-600 mt-1 font-mono">
                {formatDistanceToNow(new Date(popup.props.date), { addSuffix: true })}
              </div>
            )}
          </div>
        </Popup>
      )}

      {/* Cluster list popup — shows when clicking a dense cluster that can't expand further */}
      {clusterList && (
        <Popup
          longitude={clusterList.lng}
          latitude={clusterList.lat}
          onClose={() => setClusterList(null)}
          closeButton={false}
          maxWidth="350px"
          anchor="bottom"
        >
          <div
            className="rounded-lg"
            style={{
              background: 'rgba(10,10,10,0.97)',
              border: '1px solid rgba(102,136,170,0.3)',
              maxHeight: 320,
              width: 310,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#6688aa' }}>
                311 Requests ({clusterList.items.length})
              </span>
              <button onClick={() => setClusterList(null)} className="text-gray-600 hover:text-white text-sm">✕</button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 270 }}>
              {clusterList.items.map((item, i) => (
                <div
                  key={i}
                  className="px-3 py-2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div className="text-[11px] text-gray-300 truncate">{item.type || 'Unknown'}</div>
                  <div className="text-[10px] text-gray-500 truncate">{item.address || ''}</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[9px]" style={{ color: item.status === 'Open' ? '#6688aa' : '#555' }}>
                      {item.status || ''}
                    </span>
                    {item.date && (
                      <span className="text-[9px] text-gray-600">
                        {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Popup>
      )}
    </Map>
  )
}
