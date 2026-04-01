import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useFilteredCrime } from '../../hooks/useFilteredData'

export default function CrimeChart() {
  const data = useFilteredCrime()

  const chartData = useMemo(() => {
    if (!data.length) return []
    const counts: Record<string, number> = {}
    data.forEach((d) => {
      const type = d.primary_type || 'UNKNOWN'
      counts[type] = (counts[type] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({
        name: name.length > 12 ? name.slice(0, 12) + '…' : name,
        full: name,
        value,
      }))
  }, [data])

  if (!chartData.length) return null

  return (
    <div className="mb-5">
      <div className="text-[10px] tracking-[0.25em] uppercase mb-3 pb-2" style={{ color: '#555', fontFamily: 'JetBrains Mono, monospace', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        Top Crime Types
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#666', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 11 }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#888' }}
            formatter={(v: number, _: string, entry: { payload?: { full?: string } }) => [v, entry.payload?.full || '']}
          />
          <Bar dataKey="value" radius={[0, 2, 2, 0]} fill="#c45c5c" fillOpacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
