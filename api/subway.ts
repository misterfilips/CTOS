import type { VercelRequest, VercelResponse } from '@vercel/node'
import protobuf from 'protobufjs'
import { join } from 'path'

const FEED_MAP: Record<string, string> = {
  ace: 'nyct%2Fgtfs-ace',
  bdfm: 'nyct%2Fgtfs-bdfm',
  g: 'nyct%2Fgtfs-g',
  jz: 'nyct%2Fgtfs-jz',
  nqrw: 'nyct%2Fgtfs-nqrw',
  l: 'nyct%2Fgtfs-l',
  '1234567s': 'nyct%2Fgtfs',
}

const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 25_000

let FeedMessage: protobuf.Type | null = null

async function loadProto() {
  if (FeedMessage) return FeedMessage
  const root = await protobuf.load(join(process.cwd(), 'server', 'gtfs-realtime.proto'))
  FeedMessage = root.lookupType('transit_realtime.FeedMessage')
  return FeedMessage
}

interface StopTimeUpdate {
  stopId?: string
  arrival?: { time?: { low?: number } }
  departure?: { time?: { low?: number } }
}

interface TripUpdate {
  trip?: { tripId?: string; routeId?: string }
  stopTimeUpdate?: StopTimeUpdate[]
}

interface FeedEntity {
  id?: string
  tripUpdate?: TripUpdate
}

interface DecodedFeed {
  entity?: FeedEntity[]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { feed } = req.query
  const feedName = Array.isArray(feed) ? feed[0] : feed

  if (!feedName || !FEED_MAP[feedName]) {
    return res.status(400).json({ error: 'Unknown feed. Valid: ' + Object.keys(FEED_MAP).join(', ') })
  }

  // Check cache
  const cached = cache.get(feedName)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    res.setHeader('Cache-Control', 's-maxage=25, stale-while-revalidate=60')
    return res.json(cached.data)
  }

  try {
    const proto = await loadProto()
    const url = `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/${FEED_MAP[feedName]}`
    const response = await fetch(url)

    if (!response.ok) {
      return res.status(response.status).json({ error: 'MTA API error' })
    }

    const buffer = await response.arrayBuffer()
    const decoded = proto.decode(new Uint8Array(buffer)) as unknown as DecodedFeed

    const trips = (decoded.entity || [])
      .filter((e: FeedEntity) => e.tripUpdate)
      .map((e: FeedEntity) => {
        const tu = e.tripUpdate!
        return {
          tripId: tu.trip?.tripId || '',
          routeId: tu.trip?.routeId || '',
          stopTimeUpdates: (tu.stopTimeUpdate || []).map((stu: StopTimeUpdate) => ({
            stopId: stu.stopId || '',
            arrival: stu.arrival?.time?.low || undefined,
            departure: stu.departure?.time?.low || undefined,
          })),
        }
      })

    cache.set(feedName, { data: trips, timestamp: Date.now() })
    res.setHeader('Cache-Control', 's-maxage=25, stale-while-revalidate=60')
    return res.json(trips)
  } catch (err) {
    console.error('Error:', err)
    return res.status(500).json({ error: 'Failed to fetch feed' })
  }
}
