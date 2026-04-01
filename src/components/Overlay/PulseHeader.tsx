import { useEffect, useState } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'

export default function PulseHeader() {
  const introComplete = useDashboardStore((s) => s.introComplete)
  const [glitch, setGlitch] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 1500)
    const t2 = setTimeout(() => setGlitch(false), 3500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-3 pointer-events-none transition-opacity duration-1000"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <h1
        className={`text-3xl font-bold tracking-[0.4em] uppercase ${glitch ? 'glitch-text' : ''}`}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: '#ffffff',
          textShadow: '0 0 10px rgba(255,255,255,0.3)',
          letterSpacing: '0.4em',
        }}
      >
        ctOS
      </h1>
      <span
        className="ml-2 text-xs tracking-[0.2em] uppercase"
        style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace' }}
      >
        v3.2
      </span>
      <div className="ml-4 flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full animate-pulse"
          style={{ background: introComplete ? '#ffffff' : '#666' }}
        />
        <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>
          {introComplete ? 'CONNECTED' : 'INITIALIZING'}
        </span>
      </div>
    </div>
  )
}
