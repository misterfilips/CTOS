export function parseLatLng(lat: unknown, lng: unknown): [number, number] | null {
  const la = typeof lat === 'string' ? parseFloat(lat) : (lat as number)
  const lo = typeof lng === 'string' ? parseFloat(lng) : (lng as number)
  if (isNaN(la) || isNaN(lo) || la === 0 || lo === 0) return null
  // Chicago bounding box
  if (la < 41.64 || la > 42.03 || lo < -87.94 || lo > -87.52) return null
  return [lo, la]
}

/**
 * Compute an absolute cutoff from NOW.
 * hours = number of hours back from this moment.
 * 0 = no filter (show all). Positive = that many hours back from Date.now().
 */
export function getTimeCutoff(hours: number): number {
  if (hours <= 0) return 0
  return Date.now() - hours * 3600_000
}

/**
 * Check if a date string passes the time filter.
 * Returns true if the item should be SHOWN.
 */
export function passesTimeFilter(dateStr: string | undefined, cutoff: number): boolean {
  if (cutoff === 0) return true // no filter
  if (!dateStr) return false
  const t = new Date(dateStr).getTime()
  if (isNaN(t)) return false
  return t >= cutoff
}

export function parseTrafficLinkPoints(linkPoints: string): [number, number][] {
  const coords: [number, number][] = []
  const pairs = linkPoints.trim().split(' ')
  for (const pair of pairs) {
    const [lat, lng] = pair.split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) {
      coords.push([lng, lat])
    }
  }
  return coords
}
