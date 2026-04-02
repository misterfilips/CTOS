import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useDashboardStore } from '../../store/dashboardStore'

export default function ClockWidget() {
  const [now, setNow] = useState(new Date())
  const dark = useDashboardStore((s) => s.darkMode)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed top-3 right-4 z-50 text-right pointer-events-none">
      <div className="text-2xl font-mono tabular-nums" style={{ color: dark ? '#ffffff' : '#111', fontFamily: 'JetBrains Mono, monospace' }}>
        {format(now, 'HH:mm:ss')}
      </div>
      <div className="text-xs tracking-[0.15em] uppercase" style={{ color: dark ? '#666' : '#888', fontFamily: 'JetBrains Mono, monospace' }}>
        {format(now, 'EEEE, MMM d yyyy')} CST
      </div>
    </div>
  )
}
