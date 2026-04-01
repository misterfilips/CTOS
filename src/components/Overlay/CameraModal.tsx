import { useDashboardStore } from '../../store/dashboardStore'

export default function CameraModal() {
  const selectedCamera = useDashboardStore((s) => s.selectedCamera)
  const setSelectedCamera = useDashboardStore((s) => s.setSelectedCamera)

  if (!selectedCamera) return null

  const p = selectedCamera.props
  const type = p.camType || 'unknown'
  const intersection = p.intersection || 'Unknown Location'
  const approach = p.approach || ''
  const goLive = p.goLive || ''
  const isRedLight = type === 'red_light'
  const accentColor = isRedLight ? '#ff2244' : '#ffaa00'

  const close = () => setSelectedCamera(null)

  return (
    <div className="fixed z-[998] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
      <div
        className="p-4 rounded-xl w-[320px]"
        style={{
          background: 'rgba(15,15,35,0.97)',
          border: `1px solid ${accentColor}44`,
          boxShadow: `0 0 30px ${accentColor}22`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: accentColor }}>
            📹 {isRedLight ? 'RED LIGHT CAMERA' : 'SPEED CAMERA'}
          </span>
          <button onClick={close} className="text-gray-500 hover:text-white text-lg leading-none">&times;</button>
        </div>

        {/* Info */}
        <div className="space-y-2 text-xs" style={{ color: '#ccc' }}>
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8892b0' }}>Intersection</div>
            <div className="text-sm text-white">{intersection}</div>
          </div>
          {approach && (
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8892b0' }}>Approach Direction</div>
              <div>{approach}</div>
            </div>
          )}
          {goLive && (
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8892b0' }}>Active Since</div>
              <div>{new Date(goLive).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          )}
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8892b0' }}>Type</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
              {isRedLight ? 'Red Light Enforcement' : 'Speed Enforcement (School/Park Zone)'}
            </div>
          </div>
        </div>

        {/* Link to data portal */}
        <a
          href={isRedLight
            ? 'https://data.cityofchicago.org/Transportation/Red-Light-Camera-Locations/thvf-6diy'
            : 'https://data.cityofchicago.org/Transportation/Speed-Camera-Locations/4i42-qv3h'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 mt-3 py-2 rounded-md text-xs font-mono transition-all hover:brightness-125"
          style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
          onClick={(e) => e.stopPropagation()}
        >
          View on Chicago Data Portal
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
      {/* Click backdrop to close */}
      <div className="fixed inset-0 -z-10" onClick={close} />
    </div>
  )
}
