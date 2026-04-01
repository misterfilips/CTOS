import { useState } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import GlowCard from '../common/GlowCard'

const UNLOCKED_RANGES = [
  { label: '7d', hours: 168 },
  { label: '30d', hours: 720 },
  { label: '90d', hours: 2160 },
  { label: '1yr', hours: 8760 },
]

const LOCKED_RANGES = [
  { label: 'Predict', hours: 0 },
  { label: 'Live', hours: 1 },
]

export default function TimeFilter() {
  const timeRange = useDashboardStore((s) => s.timeRangeHours)
  const setTimeRange = useDashboardStore((s) => s.setTimeRangeHours)
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [org, setOrg] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleLockedClick = () => {
    setShowModal(true)
    setSubmitted(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Access request:', { name, email, org })
    setSubmitted(true)
    setTimeout(() => setShowModal(false), 2500)
  }

  return (
    <>
      <GlowCard className="fixed top-16 left-56 z-40 flex gap-1 items-center" style={{ padding: '10px 15px' }}>
        {/* Locked group */}
        <div
          className="flex gap-0.5 items-center px-1.5 py-0.5 rounded-md cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onClick={handleLockedClick}
          title="Request access"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" className="shrink-0 mr-1">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {LOCKED_RANGES.map((r) => (
            <span key={r.label} className="px-2 py-0.5 rounded text-xs font-mono tracking-wider" style={{ color: '#555' }}>
              {r.label}
            </span>
          ))}
        </div>

        <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {/* Unlocked ranges */}
        {UNLOCKED_RANGES.map((r) => {
          const active = timeRange === r.hours
          return (
            <button
              key={r.label}
              onClick={() => setTimeRange(r.hours)}
              className="px-3 py-1 rounded-md text-xs font-mono tracking-wider transition-all"
              style={{
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: active ? '#ffffff' : '#666',
                border: active ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
              }}
            >
              {r.label}
            </button>
          )
        })}
      </GlowCard>

      {/* Access Request Modal — ctOS style */}
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
            {/* Header bar */}
            <div className="flex items-center justify-between" style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="font-bold text-white text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  ACCESS REQUEST
                </span>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-white text-lg">&times;</button>
            </div>

            {/* Content */}
            <div style={{ padding: 15 }}>
              {submitted ? (
                <div className="text-center py-6">
                  <div className="text-2xl mb-3 text-white">&#10003;</div>
                  <div className="text-sm font-bold text-white tracking-wider uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Request Submitted
                  </div>
                  <div className="text-xs mt-2" style={{ color: '#666' }}>
                    Authorization pending review.
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs mb-5" style={{ color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>
                    Predictive analytics, live tracking, and sensitive data is only available for authorized personnel. If you are interested in bringing the ctOS system to your jurisdiction, contact us below.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-none text-sm text-white outline-none focus:border-white transition-colors"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-none text-sm text-white outline-none focus:border-white transition-colors"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                        placeholder="john@agency.gov"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>
                        Organization / Agency
                      </label>
                      <input
                        type="text"
                        required
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-none text-sm text-white outline-none focus:border-white transition-colors"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                        placeholder="CPD / CFD / OEMC"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-none text-xs font-bold uppercase tracking-[0.15em] transition-all hover:bg-white hover:text-black"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.25)',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        Submit Request
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2.5 rounded-none text-xs uppercase tracking-[0.15em] transition-all"
                        style={{ color: '#666', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
