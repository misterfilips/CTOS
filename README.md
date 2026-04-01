# PULSE NYC

A real-time NYC city analytics dashboard featuring a 3D interactive map with live data overlays from multiple free public APIs. Think sci-fi command center: dark theme, glowing data points, smooth animations, and a cinematic 3D cityscape.

![PULSE NYC Screenshot](screenshot-placeholder.png)

## Features

- **3D Interactive Map** — Mapbox GL JS with tilted perspective, 3D buildings, and dark theme
- **9 Live Data Layers** — Toggle each on/off independently
  - NYPD Crime Incidents (color-coded by severity)
  - NYPD Shooting Incidents (fatal vs non-fatal)
  - NYC 311 Service Requests (clustered)
  - Motor Vehicle Collisions (size-scaled by severity)
  - Real-Time Traffic Speeds (colored polylines)
  - MTA Subway Real-Time (GTFS-RT decoded via proxy)
  - Citi Bike Station Status (availability heat)
  - Restaurant Inspection Grades
  - NYC News Articles (geo-tagged floating cards)
- **Cinematic Intro** — Camera flies in from space with glitch title effect
- **Live Sidebar** — Animated counters, crime charts, 311 donut chart, traffic trends, activity feed
- **News Ticker** — Scrolling news bar at bottom
- **Auto-Rotate** — Slow bearing rotation when idle

## Tech Stack

- React 18+ / TypeScript / Vite
- Mapbox GL JS v3 via `react-map-gl`
- Tailwind CSS + custom CSS animations
- Zustand (state) / TanStack Query (data fetching)
- Recharts (sidebar charts)
- protobufjs (MTA GTFS-RT decoding)
- Express proxy server (CORS + protobuf decode for MTA feeds)

## Setup

### 1. Get API Keys (all free)

| Key | Where | Notes |
|-----|-------|-------|
| `VITE_MAPBOX_TOKEN` | [account.mapbox.com](https://account.mapbox.com/) | Required for map |
| `VITE_NYC_OPEN_DATA_TOKEN` | [NYC Open Data](https://data.cityofnewyork.us/profile/edit/developer_settings) | Optional but reduces throttling |
| `VITE_GNEWS_API_KEY` | [gnews.io](https://gnews.io/) | Optional, falls back to Google News RSS |

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your tokens
```

### 3. Install & Run

```bash
npm install
npm run dev
```

This starts both the Vite dev server (port 5173) and the MTA proxy server (port 3001).

## Architecture

```
pulse-nyc/
├── src/
│   ├── api/           # API clients (NYC Open Data, MTA, Citi Bike, News)
│   ├── components/
│   │   ├── Map/       # CityMap + 9 data layer components
│   │   ├── Sidebar/   # Stats, charts, activity feed
│   │   ├── Controls/  # Layer toggles, time/borough filters
│   │   ├── Overlay/   # Header, clock, news ticker
│   │   └── common/    # GlowCard, AnimatedCounter, LoadingPulse
│   ├── hooks/         # TanStack Query hooks per data source
│   ├── store/         # Zustand dashboard store
│   └── utils/         # Colors, map config, geo utilities
├── server/
│   ├── proxy.ts       # Express MTA GTFS-RT proxy
│   └── gtfs-realtime.proto
└── .env.example
```

## Data Sources

| Source | Endpoint | Poll Interval |
|--------|----------|---------------|
| NYPD Complaints | `data.cityofnewyork.us/resource/5uac-w243` | 5 min |
| NYC 311 | `data.cityofnewyork.us/resource/erm2-nwe9` | 3 min |
| Shootings | `data.cityofnewyork.us/resource/5ucz-vwe8` | 10 min |
| Collisions | `data.cityofnewyork.us/resource/h9gi-nx95` | 5 min |
| Traffic Speeds | `data.cityofnewyork.us/resource/i4gi-tjb9` | 2 min |
| MTA Subway (GTFS-RT) | `api-endpoint.mta.info` | 30 sec |
| Citi Bike (GBFS) | `gbfs.citibikenyc.com` | 60 sec |
| Restaurant Inspections | `data.cityofnewyork.us/resource/43nn-pn8j` | 30 min |
| News | `gnews.io` / Google News RSS | 15 min |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend + proxy server |
| `npm run dev:client` | Start frontend only |
| `npm run server` | Start MTA proxy only |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Credits & Data Attribution

- **NYC Open Data** — Crime, 311, Shootings, Collisions, Traffic, Restaurants
- **MTA** — Real-time subway GTFS-RT feeds
- **Citi Bike / Lyft** — Station status GBFS feeds
- **GNews / Google News** — NYC news articles
- **Mapbox** — 3D map tiles and GL JS
