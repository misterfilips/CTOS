import { useMemo } from 'react'
import { useFiltered311 } from '../../hooks/useFilteredData'

export default function ServiceChart() {
  const data = useFiltered311()

  const chartData = useMemo(() => {
    if (!data.length) return []
    const counts: Record<string, number> = {}
    data.forEach((d) => {
      const type = d.sr_type || 'Unknown'
      counts[type] = (counts[type] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }))
  }, [data])

  if (!chartData.length) return null

  const max = chartData[0]?.value || 1

  return (
    <div className="mb-5">
      <div className="text-[10px] tracking-[0.25em] uppercase mb-3 pb-2" style={{ color: '#555', fontFamily: 'JetBrains Mono, monospace', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        Top 311 Complaints
      </div>
      <div className="space-y-2 pr-1">
        {chartData.map((d) => (
          <div key={d.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] truncate max-w-[200px]" style={{ color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>{d.name}</span>
              <span className="text-[10px] font-bold text-white shrink-0 ml-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{d.value}</span>
            </div>
            <div className="h-1 w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-full transition-all" style={{ width: `${(d.value / max) * 100}%`, background: 'rgba(102,136,170,0.6)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
