import type {
  CrimeIncident,
  ServiceRequest311,
  ShootingIncident,
  VehicleCollision,
  TrafficSpeed,
  CameraLocation,
} from './types'

const BASE = 'https://data.cityofchicago.org/resource'
const token = import.meta.env.VITE_NYC_OPEN_DATA_TOKEN || ''

function buildUrl(resource: string, params: Record<string, string> = {}): string {
  const url = new URL(`${BASE}/${resource}.json`)
  if (token) url.searchParams.set('$$app_token', token)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  return url.toString()
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json()
}

function dateStr(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

// Chicago Crimes - ~7 day lag, excellent coverage
export async function fetchCrimeData(): Promise<CrimeIncident[]> {
  const url = buildUrl('ijzp-q8t2', {
    $where: `date >= '${dateStr(365)}' AND latitude IS NOT NULL`,
    $order: 'date DESC',
    $limit: '1000',
  })
  return fetchJSON<CrimeIncident[]>(url)
}

// Chicago 311 - near real-time, same day
export async function fetch311Data(): Promise<ServiceRequest311[]> {
  const url = buildUrl('v6vf-nfxy', {
    $where: `created_date >= '${dateStr(90)}' AND latitude IS NOT NULL`,
    $order: 'created_date DESC',
    $limit: '1000',
  })
  return fetchJSON<ServiceRequest311[]>(url)
}

// Chicago Shootings/Violence - ~2 day lag
export async function fetchShootingData(): Promise<ShootingIncident[]> {
  const url = buildUrl('gumc-mgzr', {
    $where: `date >= '${dateStr(365)}' AND latitude IS NOT NULL`,
    $order: 'date DESC',
    $limit: '1000',
  })
  return fetchJSON<ShootingIncident[]>(url)
}

// Chicago Traffic Crashes - same-day data
export async function fetchCollisionData(): Promise<VehicleCollision[]> {
  const url = buildUrl('85ca-t3if', {
    $where: `crash_date >= '${dateStr(365)}' AND latitude IS NOT NULL`,
    $order: 'crash_date DESC',
    $limit: '1000',
  })
  return fetchJSON<VehicleCollision[]>(url)
}

// Chicago Traffic Congestion Segments - real-time
export async function fetchTrafficData(): Promise<TrafficSpeed[]> {
  const url = buildUrl('n4j6-wkkf', {
    $limit: '2000',
  })
  return fetchJSON<TrafficSpeed[]>(url)
}

// Chicago Red Light + Speed Camera Locations (enforcement only)
export async function fetchCameraData(): Promise<CameraLocation[]> {
  const [redLight, speed] = await Promise.all([
    fetchJSON<Record<string, string>[]>(buildUrl('thvf-6diy', { $limit: '500' })),
    fetchJSON<Record<string, string>[]>(buildUrl('4i42-qv3h', { $limit: '500' })),
  ])

  const cameras: CameraLocation[] = []

  redLight.forEach((r) => {
    if (r.latitude && r.longitude) {
      cameras.push({
        type: 'red_light',
        intersection: r.intersection || '',
        latitude: r.latitude,
        longitude: r.longitude,
        first_approach: r.first_approach || '',
        second_approach: r.second_approach,
        go_live_date: r.go_live_date || '',
      })
    }
  })

  speed.forEach((s) => {
    if (s.latitude && s.longitude) {
      cameras.push({
        type: 'speed',
        intersection: s.address || '',
        latitude: s.latitude,
        longitude: s.longitude,
        first_approach: s.first_approach || '',
        second_approach: s.second_approach,
        go_live_date: s.go_live_date || '',
        location_id: s.location_id,
      })
    }
  })

  return cameras
}
