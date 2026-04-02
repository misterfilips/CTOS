import { useDashboardStore } from '../../store/dashboardStore'
import StatsPanel from './StatsPanel'
import CrimeChart from './CrimeChart'
import ServiceChart from './ServiceChart'
import ActivityFeed from './ActivityFeed'

export default function Sidebar() {
  const open = useDashboardStore((s) => s.sidebarOpen)
  const toggle = useDashboardStore((s) => s.toggleSidebar)
  const dark = useDashboardStore((s) => s.darkMode)

  return (
    <>
      <button
        onClick={toggle}
        className="fixed top-3 z-50 w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-white/10"
        style={{
          right: open ? '378px' : '8px',
          background: dark ? 'rgba(10,10,10,0.9)' : 'rgba(255,255,255,0.9)',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          color: dark ? '#fff' : '#333',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {open ? '›' : '‹'}
      </button>

      <div
        className="fixed top-0 right-0 h-screen z-40 overflow-y-auto custom-scrollbar transition-transform duration-500"
        style={{
          width: 370,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          background: dark
            ? 'linear-gradient(180deg, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.93) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(245,245,245,0.95) 100%)',
          borderLeft: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          backdropFilter: 'blur(12px)',
          padding: '60px 20px 15px 15px',
        }}
      >
        <StatsPanel />
        <CrimeChart />
        <ServiceChart />
        <ActivityFeed />
      </div>
    </>
  )
}
