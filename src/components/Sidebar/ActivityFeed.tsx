import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  useFilteredCrime,
  useFiltered311,
  useFilteredCollisions,
  useFilteredShootings,
} from '../../hooks/useFilteredData'
import type { ActivityItem } from '../../api/types'

const TYPE_META: Record<string, { label: string; color: string }> = {
  crime: { label: 'CRM', color: '#c45c5c' },
  '311': { label: '311', color: '#6688aa' },
  collision: { label: 'CRS', color: '#b8963c' },
  shooting: { label: 'SHT', color: '#b84040' },
}

export default function ActivityFeed() {
  const crime = useFilteredCrime()
  const s311 = useFiltered311()
  const collisions = useFilteredCollisions()
  const shootings = useFilteredShootings()

  const feed = useMemo(() => {
    const items: ActivityItem[] = []

    crime.slice(0, 8).forEach((c, i) => {
      items.push({
        id: `crime-${c.id || i}`,
        type: 'crime',
        text: `${c.primary_type}: ${c.description} — ${c.block || ''}`,
        timestamp: new Date(c.date || Date.now()),
        color: '#c45c5c',
      })
    })
    s311.slice(0, 8).forEach((s, i) => {
      items.push({
        id: `311-${s.sr_number || i}`,
        type: '311',
        text: `${s.sr_type} — ${s.street_address || ''}`,
        timestamp: new Date(s.created_date || Date.now()),
        color: '#6688aa',
      })
    })
    collisions.slice(0, 5).forEach((c, i) => {
      items.push({
        id: `coll-${c.crash_record_id || i}`,
        type: 'collision',
        text: `Crash: ${c.injuries_total} injured — ${c.first_crash_type || ''} ${c.street_name || ''}`,
        timestamp: new Date(c.crash_date || Date.now()),
        color: '#b8963c',
      })
    })
    shootings.slice(0, 5).forEach((s, i) => {
      items.push({
        id: `shoot-${s.unique_id || i}`,
        type: 'shooting',
        text: `${s.victimization_primary}: ${s.incident_iucr_secondary || s.incident_primary || ''} — ${s.location_description || ''}`,
        timestamp: new Date(s.date || Date.now()),
        color: '#b84040',
      })
    })

    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [crime, s311, collisions, shootings])

  return (
    <div>
      <div className="text-[10px] tracking-[0.25em] uppercase mb-3 pb-2" style={{ color: '#555', fontFamily: 'JetBrains Mono, monospace', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        Activity Feed
      </div>
      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {feed.slice(0, 30).map((item, idx) => {
          const meta = TYPE_META[item.type] || { label: '???', color: '#666' }
          return (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-start gap-2.5 py-2 transition-all"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
            >
              <span
                className="text-[9px] font-bold mt-0.5 px-1.5 py-0.5 shrink-0 rounded-sm"
                style={{ background: meta.color + '25', color: meta.color, fontFamily: 'JetBrains Mono, monospace' }}
              >
                {meta.label}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-400 truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{item.text}</div>
                <div className="text-[10px]" style={{ color: '#444', fontFamily: 'JetBrains Mono, monospace' }}>
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </div>
              </div>
            </div>
          )
        })}
        {!feed.length && (
          <div className="text-xs text-center py-4" style={{ color: '#444', fontFamily: 'JetBrains Mono, monospace' }}>No data for this time range</div>
        )}
      </div>
    </div>
  )
}
