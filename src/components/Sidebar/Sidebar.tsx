import { useDashboardStore } from '../../store/dashboardStore'
import StatsPanel from './StatsPanel'
import CrimeChart from './CrimeChart'
import ServiceChart from './ServiceChart'
import ActivityFeed from './ActivityFeed'
import ClockWidget from '../Overlay/ClockWidget'
import WeatherWidget from '../Overlay/WeatherWidget'
import TimeFilter from '../Controls/TimeFilter'
import LayerToggle from '../Controls/LayerToggle'
import NewsTicker from '../Overlay/NewsTicker'

export default function Sidebar() {
  const open = useDashboardStore((s) => s.sidebarOpen)
  const toggle = useDashboardStore((s) => s.toggleSidebar)
  const dark = useDashboardStore((s) => s.darkMode)

  return (
    <>
      <button
        onClick={toggle}
        className="fixed top-3 z-50 w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-white/10"
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
        className="fixed top-0 right-0 h-screen z-40 overflow-y-auto custom-scrollbar transition-transform duration-500 w-full md:w-[370px]"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          background: dark
            ? 'linear-gradient(180deg, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.93) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(245,245,245,0.95) 100%)',
          borderLeft: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          backdropFilter: 'blur(12px)',
          padding: '15px 20px 15px 15px',
        }}
      >
        {/* ===== MOBILE ONLY: everything stacked in sidebar ===== */}
        <div className="block md:hidden">
          {/* Header row: ctOS + clock */}
          <div className="flex items-center justify-between mb-4">
            <h1
              className="text-2xl font-bold tracking-[0.3em] uppercase"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: dark ? '#fff' : '#111' }}
            >
              ctOS
            </h1>
            <ClockWidget inline />
          </div>

          {/* Weather */}
          <div className="mb-4">
            <WeatherWidget inline />
          </div>

          {/* Time filter — render inline by wrapping and overriding position */}
          <div className="mb-4 relative" style={{ position: 'relative' }}>
            <div style={{ position: 'static' }}>
              <TimeFilter inline />
            </div>
          </div>

          {/* Data layers — render inline */}
          <div className="mb-4">
            <LayerToggle inline />
          </div>
        </div>

        {/* ===== DESKTOP ONLY: top spacing ===== */}
        <div className="hidden md:block" style={{ height: 45 }} />

        {/* ===== SHARED: stats, charts, activity feed ===== */}
        <StatsPanel />
        <CrimeChart />
        <ServiceChart />
        <ActivityFeed />

        {/* ===== MOBILE ONLY: news at bottom ===== */}
        <div className="block md:hidden mt-4">
          <NewsTicker inline />
        </div>
      </div>
    </>
  )
}
