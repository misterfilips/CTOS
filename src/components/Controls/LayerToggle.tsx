import { useDashboardStore, type LayerVisibility } from '../../store/dashboardStore'
import GlowCard from '../common/GlowCard'

const LAYERS: { key: keyof LayerVisibility; label: string; color: string }[] = [
  { key: 'crime', label: 'Crime', color: '#c45c5c' },
  { key: 'shootings', label: 'Shootings', color: '#b84040' },
  { key: 'service311', label: '311 Requests', color: '#6688aa' },
  { key: 'collisions', label: 'Crashes', color: '#b8963c' },
  { key: 'cameras', label: 'Cameras', color: '#7a9e9e' },
  { key: 'permits', label: 'Permits', color: '#6a9a7a' },
  { key: 'potholes', label: 'Potholes', color: '#aa8844' },
  { key: 'news', label: 'News', color: '#8888aa' },
  { key: 'buildings3d', label: '3D Buildings', color: '#777777' },
]

export default function LayerToggle() {
  const layers = useDashboardStore((s) => s.layers)
  const toggle = useDashboardStore((s) => s.toggleLayer)

  return (
    <GlowCard className="fixed top-16 left-4 z-40 w-52" style={{ padding: 15 }}>
      <div className="text-[10px] tracking-[0.25em] uppercase mb-3 pb-2" style={{ color: '#555', fontFamily: 'JetBrains Mono, monospace', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        Data Layers
      </div>
      <div className="space-y-0.5">
        {LAYERS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className="flex items-center gap-3 w-full py-1.5 rounded text-xs transition-all hover:bg-white/5"
            style={{ opacity: layers[key] ? 1 : 0.3, fontFamily: 'JetBrains Mono, monospace' }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: layers[key] ? color : '#333' }}
            />
            <span style={{ color: layers[key] ? '#ccc' : '#444' }}>{label}</span>
          </button>
        ))}
      </div>
    </GlowCard>
  )
}
