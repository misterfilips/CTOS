import type { SubwayTripUpdate } from './types'

const FEED_MAP: Record<string, string> = {
  ace: 'nyct%2Fgtfs-ace',
  bdfm: 'nyct%2Fgtfs-bdfm',
  g: 'nyct%2Fgtfs-g',
  jz: 'nyct%2Fgtfs-jz',
  nqrw: 'nyct%2Fgtfs-nqrw',
  l: 'nyct%2Fgtfs-l',
  '1234567s': 'nyct%2Fgtfs',
}

export const FEED_NAMES = Object.keys(FEED_MAP)

export async function fetchSubwayFeed(feedName: string): Promise<SubwayTripUpdate[]> {
  try {
    const res = await fetch(`/api/subway/${feedName}`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function fetchAllSubwayFeeds(): Promise<SubwayTripUpdate[]> {
  const results = await Promise.allSettled(FEED_NAMES.map(fetchSubwayFeed))
  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
}
