import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CityMap from './components/Map/CityMap'
import PulseHeader from './components/Overlay/PulseHeader'
import ClockWidget from './components/Overlay/ClockWidget'
import NewsTicker from './components/Overlay/NewsTicker'
import LayerToggle from './components/Controls/LayerToggle'
import TimeFilter from './components/Controls/TimeFilter'
import BoroughFilter from './components/Controls/BoroughFilter'
import Sidebar from './components/Sidebar/Sidebar'
import CameraModal from './components/Overlay/CameraModal'
import WeatherWidget from './components/Overlay/WeatherWidget'
import { useDashboardStore } from './store/dashboardStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: false,
    },
  },
})

function LiveTickProvider() {
  const timeRange = useDashboardStore((s) => s.timeRangeHours)
  const tick = useDashboardStore((s) => s.incrementLiveTick)
  useEffect(() => {
    if (timeRange > 24) return
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [timeRange, tick])
  return null
}

function DarkModeToggle() {
  const darkMode = useDashboardStore((s) => s.darkMode)
  const toggle = useDashboardStore((s) => s.toggleDarkMode)
  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:scale-110"
      style={{
        background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
        color: darkMode ? '#999' : '#555',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 16,
      }}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? '☀' : '☾'}
    </button>
  )
}

function AppShell() {
  const darkMode = useDashboardStore((s) => s.darkMode)

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: darkMode ? '#0a0a0a' : '#f0f0f0' }}
      data-theme={darkMode ? 'dark' : 'light'}
    >
      <CityMap />

      {/* Desktop header + clock — hidden on mobile (moved to sidebar) */}
      <div className="hidden md:block">
        <PulseHeader />
        <ClockWidget />
      </div>

      {/* Desktop floating controls — hidden on mobile (moved to sidebar) */}
      <div className="hidden md:block">
        <LayerToggle />
        <TimeFilter />
        <BoroughFilter />
        <WeatherWidget />
      </div>

      {/* Desktop news ticker at bottom — hidden on mobile (moved to sidebar) */}
      <div className="hidden md:block">
        <NewsTicker />
      </div>

      {/* Sidebar: on desktop it's the right panel. On mobile it's EVERYTHING. */}
      <Sidebar />
      <CameraModal />
      <DarkModeToggle />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LiveTickProvider />
      <AppShell />
    </QueryClientProvider>
  )
}

export default App
