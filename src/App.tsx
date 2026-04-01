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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LiveTickProvider />
      <div className="relative w-full h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
        <CityMap />
        <PulseHeader />
        <ClockWidget />
        <LayerToggle />
        <TimeFilter />
        <BoroughFilter />
        <WeatherWidget />
        <Sidebar />
        <CameraModal />
        <NewsTicker />
      </div>
    </QueryClientProvider>
  )
}

export default App
