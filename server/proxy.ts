import express from 'express'
import cors from 'cors'
import protobuf from 'protobufjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
app.use(cors())

const FEED_MAP: Record<string, string> = {
  ace: 'nyct%2Fgtfs-ace',
  bdfm: 'nyct%2Fgtfs-bdfm',
  g: 'nyct%2Fgtfs-g',
  jz: 'nyct%2Fgtfs-jz',
  nqrw: 'nyct%2Fgtfs-nqrw',
  l: 'nyct%2Fgtfs-l',
  '1234567s': 'nyct%2Fgtfs',
}

// Cache for decoded feeds
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 25_000

// Load GTFS-RT proto definition
let FeedMessage: protobuf.Type | null = null

async function loadProto() {
  try {
    const root = await protobuf.load(join(__dirname, 'gtfs-realtime.proto'))
    FeedMessage = root.lookupType('transit_realtime.FeedMessage')
    console.log('[proxy] GTFS-RT proto loaded')
  } catch (err) {
    console.error('[proxy] Failed to load proto, will use JSON fallback:', err)
  }
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

app.get('/api/subway/:feed', async (req, res) => {
  const feedName = req.params.feed
  const feedPath = FEED_MAP[feedName]

  if (!feedPath) {
    res.status(400).json({ error: 'Unknown feed' })
    return
  }

  // Check cache
  const cached = cache.get(feedName)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    res.json(cached.data)
    return
  }

  try {
    const url = `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/${feedPath}`
    const response = await fetch(url)

    if (!response.ok) {
      res.status(response.status).json({ error: 'MTA API error' })
      return
    }

    const buffer = await response.arrayBuffer()

    if (!FeedMessage) {
      res.status(500).json({ error: 'Proto not loaded' })
      return
    }

    const decoded = FeedMessage.decode(new Uint8Array(buffer)) as unknown as DecodedFeed
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
    res.json(trips)
  } catch (err) {
    console.error(`[proxy] Error fetching ${feedName}:`, err)
    res.status(500).json({ error: 'Failed to fetch feed' })
  }
})

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', feeds: Object.keys(FEED_MAP) })
})

const PORT = 3002
loadProto().then(() => {
  app.listen(PORT, () => {
    console.log(`[proxy] MTA proxy server running on http://localhost:${PORT}`)
  })
})
