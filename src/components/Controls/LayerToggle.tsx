import { useState } from 'react'
import { useDashboardStore, type LayerVisibility } from '../../store/dashboardStore'
import GlowCard from '../common/GlowCard'

const OPEN_DATA_LAYERS: { key: keyof LayerVisibility; label: string; color: string }[] = [
  { key: 'crime', label: 'Crime', color: '#c45c5c' },
  { key: 'shootings', label: 'Shootings', color: '#b84040' },
  { key: 'service311', label: '311 Requests', color: '#6688aa' },
  { key: 'collisions', label: 'Crashes', color: '#b8963c' },
  { key: 'permits', label: 'Permits', color: '#6a9a7a' },
  { key: 'potholes', label: 'Potholes', color: '#aa8844' },
  { key: 'cameras', label: 'Cameras', color: '#7a9e9e' },
  { key: 'news', label: 'News', color: '#8888aa' },
  { key: 'buildings3d', label: '3D Buildings', color: '#777777' },
]

const LAW_ENFORCEMENT_LAYERS = [
  { label: 'Patrol Routes', color: '#5588cc' },
  { label: 'Warrant Locations', color: '#dd6644' },
  { label: 'Probation Zones', color: '#bb7744' },
  { label: 'Sex Offenders', color: '#aa5566' },
  { label: 'Drug Hotspots', color: '#9955aa' },
  { label: 'Gunshot Detection', color: '#cc4455' },
  { label: 'Gang Territories', color: '#cc5555' },
  { label: 'Surveillance Mesh', color: '#66aaaa' },
  { label: 'Predictive Zones', color: '#7788bb' },
  { label: 'Undercover Units', color: '#888888' },
  { label: 'Fugitive Tracking', color: '#aa6633' },
  { label: 'Parolee Monitor', color: '#998866' },
]

const INTELLIGENCE_LAYERS = [
  { label: 'Groups of Interest', color: '#cc7744' },
  { label: 'Federal Watchlist', color: '#aa6633' },
  { label: 'CI Network', color: '#669977' },
  { label: 'Comms Intercept', color: '#7799aa' },
  { label: 'Financial Flags', color: '#aa9955' },
]

function SectionHeader({ label }: { label: string }) {
  return (
    <div
      className="text-[10px] tracking-[0.25em] uppercase mt-4 mb-2 pb-1.5"
      style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {label}
    </div>
  )
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

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
      <GlowCard className="fixed top-16 left-4 z-40 w-52 overflow-y-auto custom-scrollbar" style={{ padding: 15, maxHeight: 'calc(100vh - 100px)' }}>

        {/* Open Data */}
        <div
          className="text-[10px] tracking-[0.25em] uppercase mb-2 pb-1.5"
          style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          Open Data
        </div>
        <div className="space-y-0.5">
          {OPEN_DATA_LAYERS.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className="flex items-center gap-3 w-full py-1.5 rounded text-xs transition-all hover:bg-white/5"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: layers[key] ? color : '#333' }}
              />
              <span style={{ color: layers[key] ? '#ccc' : '#666' }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Law Enforcement */}
        <SectionHeader label="Law Enforcement" />
        <div className="space-y-0.5">
          {LAW_ENFORCEMENT_LAYERS.map(({ label, color }) => (
            <button
              key={label}
              onClick={() => handleLockedClick(label)}
              className="flex items-center gap-3 w-full py-1.5 rounded text-xs transition-all hover:bg-white/5 group"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: '#555' }}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color, opacity: 0.4 }} />
              <span>{label}</span>
              <LockIcon />
            </button>
          ))}
        </div>

        {/* Intelligence */}
        <SectionHeader label="Intelligence" />
        <div className="space-y-0.5">
          {INTELLIGENCE_LAYERS.map(({ label, color }) => (
            <button
              key={label}
              onClick={() => handleLockedClick(label)}
              className="flex items-center gap-3 w-full py-1.5 rounded text-xs transition-all hover:bg-white/5 group"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: '#555' }}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color, opacity: 0.4 }} />
              <span>{label}</span>
              <LockIcon />
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
            style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 0 60px rgba(255,255,255,0.05)' }}
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
              <form onSubmit={(e) => { e.preventDefault(); setShowModal(false) }} className="space-y-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>Full Name</label>
                  <input type="text" className="w-full rounded-none text-sm text-white outline-none focus:border-white transition-colors"
                    style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'JetBrains Mono, monospace' }}
                    placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>Email</label>
                  <input type="email" className="w-full rounded-none text-sm text-white outline-none focus:border-white transition-colors"
                    style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'JetBrains Mono, monospace' }}
                    placeholder="john@organization.org" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>Organization</label>
                  <input type="text" className="w-full rounded-none text-sm text-white outline-none focus:border-white transition-colors"
                    style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'JetBrains Mono, monospace' }}
                    placeholder="Your organization" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>Message</label>
                  <textarea rows={3} className="w-full rounded-none text-sm text-white outline-none focus:border-white transition-colors resize-none"
                    style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'JetBrains Mono, monospace' }}
                    placeholder="Tell us about your use case..." />
                </div>
                <button type="submit" className="w-full rounded-none text-xs font-bold uppercase tracking-[0.15em] transition-all hover:bg-white hover:text-black"
                  style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>
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
