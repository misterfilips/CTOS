import { useState } from 'react'
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

const LOCKED_LAYERS = [
  { label: 'Patrol Routes', color: '#5588cc' },
  { label: 'Gang Territories', color: '#cc5555' },
  { label: 'Warrant Locations', color: '#dd6644' },
  { label: 'Probation Zones', color: '#bb7744' },
  { label: 'Sex Offenders', color: '#aa5566' },
  { label: 'Drug Hotspots', color: '#9955aa' },
  { label: 'Surveillance Mesh', color: '#66aaaa' },
  { label: 'Gunshot Detection', color: '#cc4455' },
  { label: 'Predictive Zones', color: '#7788bb' },
  { label: 'Undercover Units', color: '#888888' },
  { label: 'Federal Watchlist', color: '#aa6633' },
  { label: 'CI Network', color: '#669977' },
]

export default function LayerToggle() {
  const layers = useDashboardStore((s) => s.layers)
  const toggle = useDashboardStore((s) => s.toggleLayer)
  const [showModal, setShowModal] = useState(false)
  const [clickedLayer, setClickedLayer] = useState('')

  const handleLockedClick = (label: string) => {
    setClickedLayer(label)
    setShowModal(true)
  }

  return (
    <>
      <GlowCard className="fixed top-16 left-4 z-40 w-52 overflow-y-auto" style={{ padding: 15, maxHeight: 'calc(100vh - 100px)' }}>
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

        {/* Locked premium layers */}
        <div className="text-[10px] tracking-[0.25em] uppercase mt-4 mb-3 pb-2" style={{ color: '#555', fontFamily: 'JetBrains Mono, monospace', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          Premium Layers
        </div>
        <div className="space-y-0.5">
          {LOCKED_LAYERS.map(({ label, color }) => (
            <button
              key={label}
              onClick={() => handleLockedClick(label)}
              className="flex items-center gap-3 w-full py-1.5 rounded text-xs transition-all hover:bg-white/5 group"
              style={{ opacity: 0.35, fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: color }}
              />
              <span style={{ color: '#444' }}>{label}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" className="ml-auto shrink-0 group-hover:stroke-white/50">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </button>
          ))}
        </div>
      </GlowCard>

      {/* Signup modal for locked layers */}
      {showModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div
            className="rounded-none w-[420px]"
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 0 60px rgba(255,255,255,0.05)',
            }}
          >
            <div className="flex items-center justify-between" style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="font-bold text-white text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {clickedLayer}
                </span>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-white text-lg">&times;</button>
            </div>
            <div style={{ padding: 15 }}>
              <p className="text-xs mb-5" style={{ color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>
Predictive analytics, live tracking, and sensitive data is only available for authorized personnel. If you are interested in bringing the ctOS system to your jurisdiction, contact us below.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); setShowModal(false) }} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-none text-sm text-white outline-none focus:border-white transition-colors"
                    style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'JetBrains Mono, monospace' }}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-none text-sm text-white outline-none focus:border-white transition-colors"
                    style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'JetBrains Mono, monospace' }}
                    placeholder="john@agency.gov"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>
                    Organization / Agency
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-none text-sm text-white outline-none focus:border-white transition-colors"
                    style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'JetBrains Mono, monospace' }}
                    placeholder="CPD / CFD / OEMC"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-none text-xs font-bold uppercase tracking-[0.15em] transition-all hover:bg-white hover:text-black"
                  style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Request Access
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
